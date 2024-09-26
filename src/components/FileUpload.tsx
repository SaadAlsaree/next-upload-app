// components/FileUpload.tsx
'use client';
import { useState, ChangeEvent, FormEvent } from 'react';

export default function FileUpload() {
   const [file, setFile] = useState<File | null>(null);

   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
         setFile(event.target.files[0]);
      }
   };

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!file) return;

      const formData = new FormData();
      formData.append('files', file);
      formData.append('path', 'upload');
      formData.append('root', 'public');

      const res = await fetch('/api/upload', {
         method: 'POST',
         body: formData
      });

      if (res.ok) {
         console.log('File uploaded successfully');
      } else {
         console.error('File upload failed');
      }
   };

   return (
      <form onSubmit={handleSubmit}>
         <input type='file' onChange={handleFileChange} />
         <button type='submit'>Upload</button>
      </form>
   );
}
