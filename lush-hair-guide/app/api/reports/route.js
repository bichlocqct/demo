import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, useSupabase } from '@/lib/supabase';
import { pool, usePostgres } from '@/lib/db';

const isVercel = process.env.VERCEL || process.env.NOW_BUILDER;
const localDataPath = path.join(process.cwd(), 'data', 'reports.json');
const tempDataPath = path.join('/tmp', 'reports.json');
const dataFilePath = isVercel ? tempDataPath : localDataPath;

// Map Postgres snake_case back to Client-side camelCase
function mapToCamel(dbReport) {
  if (!dbReport) return null;
  return {
    id: dbReport.id,
    createdAt: dbReport.created_at,
    customerName: dbReport.customer_name,
    customerPhone: dbReport.customer_phone || '',
    store: dbReport.store,
    date: dbReport.date ? new Date(dbReport.date).toISOString().split('T')[0] : '',
    symptoms: dbReport.symptoms || [],
    routine: dbReport.routine || '',
    purchased: !!dbReport.purchased,
    feedback: dbReport.feedback || '',
    staffName: dbReport.staff_name || '',
    consentNghiDinh13: !!dbReport.consent_nghi_dinh_13
  };
}

// Map Client-side camelCase to Postgres snake_case
function mapToSnake(report) {
  if (!report) return null;
  return {
    id: report.id,
    created_at: report.createdAt,
    customer_name: report.customerName,
    customer_phone: report.customerPhone || '',
    store: report.store,
    date: report.date,
    symptoms: report.symptoms || [],
    routine: report.routine || '',
    purchased: !!report.purchased,
    feedback: report.feedback || '',
    staff_name: report.staffName || '',
    consent_nghi_dinh_13: !!report.consentNghiDinh13
  };
}

// Ensure database file and directory exist (for local fallback)
function ensureDatabase() {
  if (isVercel) {
    if (!fs.existsSync(tempDataPath)) {
      if (fs.existsSync(localDataPath)) {
        try {
          fs.copyFileSync(localDataPath, tempDataPath);
        } catch (e) {
          fs.writeFileSync(tempDataPath, JSON.stringify([]));
        }
      } else {
        fs.writeFileSync(tempDataPath, JSON.stringify([]));
      }
    }
  } else {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]));
    }
  }
}

export async function GET() {
  try {
    if (usePostgres) {
      // 1. Connection via direct PostgreSQL URL (Preferred when connection string is provided)
      const result = await pool.query('SELECT * FROM public.reports ORDER BY created_at DESC');
      return NextResponse.json((result.rows || []).map(mapToCamel));
    } else if (useSupabase) {
      // 2. Connection via Supabase JS client
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return NextResponse.json((data || []).map(mapToCamel));
    } else {
      // 3. Fallback to Local JSON Storage
      ensureDatabase();
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      const reports = JSON.parse(fileContent);
      return NextResponse.json(reports);
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Simple validation
    const { customerName, customerPhone, store, date, symptoms, routine, purchased, feedback, staffName, consentNghiDinh13 } = body;
    if (!customerName || !store || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newReport = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone: customerPhone || '',
      store,
      date,
      symptoms: symptoms || [],
      routine: routine || '',
      purchased: !!purchased,
      feedback: feedback || '',
      staffName: staffName || '',
      consentNghiDinh13: !!consentNghiDinh13
    };

    if (usePostgres) {
      const dbPayload = mapToSnake(newReport);
      const query = `
        INSERT INTO public.reports (
          id, created_at, customer_name, customer_phone, store, date, symptoms, routine, purchased, feedback, staff_name, consent_nghi_dinh_13
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
      const values = [
        dbPayload.id,
        dbPayload.created_at,
        dbPayload.customer_name,
        dbPayload.customer_phone,
        dbPayload.store,
        dbPayload.date,
        dbPayload.symptoms,
        dbPayload.routine,
        dbPayload.purchased,
        dbPayload.feedback,
        dbPayload.staff_name,
        dbPayload.consent_nghi_dinh_13
      ];
      
      const result = await pool.query(query, values);
      return NextResponse.json(mapToCamel(result.rows[0]), { status: 201 });
    } else if (useSupabase) {
      const dbPayload = mapToSnake(newReport);
      const { data, error } = await supabase
        .from('reports')
        .insert([dbPayload])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return NextResponse.json(mapToCamel(data), { status: 201 });
    } else {
      ensureDatabase();
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      const reports = JSON.parse(fileContent);
      reports.push(newReport);
      
      fs.writeFileSync(dataFilePath, JSON.stringify(reports, null, 2));
      
      return NextResponse.json(newReport, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing report id' }, { status: 400 });
    }

    if (usePostgres) {
      await pool.query('DELETE FROM public.reports WHERE id = $1', [id]);
      return NextResponse.json({ success: true });
    } else if (useSupabase) {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      return NextResponse.json({ success: true });
    } else {
      ensureDatabase();
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      let reports = JSON.parse(fileContent);
      reports = reports.filter(r => r.id !== id);
      
      fs.writeFileSync(dataFilePath, JSON.stringify(reports, null, 2));
      
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
