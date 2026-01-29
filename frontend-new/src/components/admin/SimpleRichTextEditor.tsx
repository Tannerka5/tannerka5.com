import { useRef, useEffect, useState, type FC } from 'react';
import FileUpload from './FileUpload';

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SimpleRichTextEditor: FC<SimpleRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing...',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertImage = (url: string) => {
    if (url) {
      execCommand('insertImage', url);
      setShowImageDialog(false);
      setImageUrl('');
    }
  };

  const ToolbarButton: FC<{ onClick: () => void; title: string; children: React.ReactNode }> = ({
    onClick,
    title,
    children,
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-earth dark:text-gray-300"
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-sage/20 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        {/* Headings */}
        <div className="flex items-center border-r border-sage/20 dark:border-gray-600 pr-1 mr-1">
          <ToolbarButton onClick={() => execCommand('formatBlock', '<h1>')} title="Heading 1">
            H1
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('formatBlock', '<h2>')} title="Heading 2">
            H2
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('formatBlock', '<h3>')} title="Heading 3">
            H3
          </ToolbarButton>
        </div>

        {/* Text Formatting */}
        <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
          <u>U</u>
        </ToolbarButton>

        {/* Lists */}
        <div className="flex items-center border-l border-r border-sage/20 dark:border-gray-600 px-1 mx-1">
          <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
            <span>• List</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
            <span>1. List</span>
          </ToolbarButton>
        </div>

        {/* Indentation */}
        <div className="flex items-center border-l border-sage/20 dark:border-gray-600 pl-1 ml-1">
          <ToolbarButton onClick={() => execCommand('outdent')} title="Decrease Indent">
            ←
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('indent')} title="Increase Indent">
            →
          </ToolbarButton>
        </div>

        {/* Image */}
        <div className="flex items-center border-l border-sage/20 dark:border-gray-600 pl-1 ml-1">
          <ToolbarButton
            onClick={() => setShowImageDialog(!showImageDialog)}
            title="Insert Image"
          >
            🖼️
          </ToolbarButton>
        </div>
      </div>

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="p-4 border-b border-sage/20 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL or upload file"
              className="w-full px-3 py-2 text-sm border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => insertImage(imageUrl)}
                className="px-3 py-1 text-sm bg-sage text-white rounded hover:bg-sage-dark"
              >
                Insert
              </button>
              <FileUpload
                currentUrl={imageUrl}
                onUploadComplete={(url) => {
                  setImageUrl(url);
                  insertImage(url);
                }}
                accept="image/*"
                label=""
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  setShowImageDialog(false);
                  setImageUrl('');
                }}
                className="px-3 py-1 text-sm border border-sage/20 dark:border-gray-600 text-earth dark:text-gray-100 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
          handleInput();
        }}
        className="min-h-[400px] p-4 text-earth dark:text-gray-100 focus:outline-none prose prose-lg dark:prose-invert max-w-none"
        style={{
          wordBreak: 'break-word',
        }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default SimpleRichTextEditor;
