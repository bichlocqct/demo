import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const isVercel = process.env.VERCEL || process.env.NOW_BUILDER;
const localDataPath = path.join(process.cwd(), 'data', 'reports.json');
const tempDataPath = path.join('/tmp', 'reports.json');
const dataFilePath = isVercel ? tempDataPath : localDataPath;

// Ensure database file and directory exist
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
    ensureDatabase();
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const reports = JSON.parse(fileContent);
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    ensureDatabase();
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

    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const reports = JSON.parse(fileContent);
    reports.push(newReport);
    
    fs.writeFileSync(dataFilePath, JSON.stringify(reports, null, 2));
    
    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error('Error saving report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    ensureDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing report id' }, { status: 400 });
    }

    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    let reports = JSON.parse(fileContent);
    reports = reports.filter(r => r.id !== id);
    
    fs.writeFileSync(dataFilePath, JSON.stringify(reports, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
