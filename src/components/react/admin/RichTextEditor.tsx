import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize Quill instance
    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: placeholder || 'Write your blog post content here...',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean']
        ]
      }
    });

    quillInstance.current = quill;

    if (value) {
      quill.root.innerHTML = value;
    }

    quill.on('text-change', () => {
      if (!isInternalChange.current) {
        const html = quill.root.innerHTML;
        onChange(html === '<p><br></p>' ? '' : html);
      }
    });

    return () => {
      quillInstance.current = null;
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    if (quillInstance.current) {
      const currentContent = quillInstance.current.root.innerHTML;
      if (value !== currentContent && (value || currentContent !== '<p><br></p>')) {
        isInternalChange.current = true;
        quillInstance.current.root.innerHTML = value || '';
        isInternalChange.current = false;
      }
    }
  }, [value]);

  return <div ref={editorRef} style={{ height: '280px' }} />;
}
