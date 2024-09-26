import { NextResponse } from "next/server";
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { ReadableStream } from 'web-streams-polyfill';

const pump = promisify(pipeline);

export async function POST(req: Request) {

    try {
        const formData = await req.formData();
        const files = formData.getAll('files');
        const path = formData.get('path') as string;
        const root = formData.get('root') as string;


        if (files.length > 0) {
            const file = files[0] as File;
            const uniqueFileName = uuidv4();
            const fileExtension = file.name.split('.').pop(); // Extract file extension
            const filePath = `./${root}/${path}/${uniqueFileName}.${fileExtension}`;
            const readableWebStream = file.stream();
            const nodeReadableStream = Readable.fromWeb(readableWebStream as ReadableStream<Uint8Array>);
            await pump(nodeReadableStream, fs.createWriteStream(filePath));
            return NextResponse.json({ status: "success", data: { size: file.size, ext: fileExtension, path: filePath } });
        } else {
            return NextResponse.json({ status: "fail", data: "No file uploaded" });
        }
    } catch (e) {
        return NextResponse.json({ status: "fail", data: e });
    }
}

export async function GET(req: Request) {
    const body = await req.json();
    console.log(body);
    return NextResponse.json({ status: "success", data: "GET" });
}