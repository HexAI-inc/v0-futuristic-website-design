'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Type, 
  Square, 
  Share2, 
  Minus, 
  GripVertical, 
  Trash2, 
  Plus,
  List as ListIcon,
  ExternalLink,
  Settings2,
  Layout as LayoutIcon,
  Eye as EyeIcon,
  ArrowLeft,
  Save,
  Loader2,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Type as TypeIcon,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- Types ---

export type BlockType = 'heading' | 'text' | 'button' | 'social' | 'divider' | 'spacer' | 'list' | 'footer';

export interface EmailBlock {
  id: string;
  type: BlockType;
  content: any;
}

interface EmailBuilderProps {
  initialHtml?: string;
  onChange: (html: string) => void;
  templateData: {
    name: string;
    subject: string;
    description: string;
  };
  onTemplateDataChange: (data: any) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

// --- Constants ---

const PRIMARY_GREEN = '#2d5a47';
const SECONDARY_GOLD = '#e2b13c';
const TEXT_COLOR = '#334155'; // slate-700
const LIGHT_BG = '#f8fafc'; // slate-50

// --- Rich Text Editor Component ---

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder,
  className = ""
}: { 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
  className?: string;
}) => {
  const editorRef = React.useRef<HTMLDivElement>(null);

  // Update editor content when value changes externally (e.g. on block select)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Ensure we use <p> tags for new lines
      // document.execCommand('formatBlock', false, 'p');
    }
  };

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={`min-h-[150px] p-4 bg-card border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed overflow-y-auto ${className}`}
        style={{ color: 'inherit' }}
      />
      {!value && (
        <div className="absolute top-4 left-4 text-muted-foreground/40 pointer-events-none text-sm">
          {placeholder}
        </div>
      )}
    </div>
  );
};

// --- Helper: Generate HTML from Blocks ---

const generateHtmlFromBlocks = (blocks: EmailBlock[]): string => {
  return blocks.map(block => {
    const style = {
      textAlign: block.content.align || 'left',
      fontWeight: block.content.bold ? 'bold' : 'normal',
      fontStyle: block.content.italic ? 'italic' : 'normal',
      color: block.content.color || (block.type === 'heading' ? PRIMARY_GREEN : TEXT_COLOR),
      fontSize: block.content.fontSize === 'sm' ? '14px' : 
                block.content.fontSize === 'lg' ? '18px' : 
                block.content.fontSize === 'xl' ? '24px' : '16px',
      fontFamily: 'sans-serif',
      lineHeight: '1.7',
      marginBottom: '20px'
    };

    const styleString = Object.entries(style)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}: ${v}`)
      .join('; ');

    switch (block.type) {
      case 'heading':
        return `
          <h2 style="${styleString}; font-size: ${block.content.fontSize === 'xl' ? '32px' : '24px'}; font-weight: bold; margin-top: 8px;">
            ${block.content.text || 'Heading'}
          </h2>`;

      case 'text':
        // If it looks like HTML (contains tags), use it directly, otherwise wrap in paragraphs
        const hasHtml = /<[a-z][\s\S]*>/i.test(block.content.text || '');
        const content = hasHtml 
          ? (block.content.text || '') 
          : (block.content.text || '')
              .split('\n')
              .filter((p: string) => p.trim())
              .map((p: string) => `<p style="margin-bottom: 16px;">${p}</p>`)
              .join('');
        
        return `<div style="${styleString}">${content || '<p>&nbsp;</p>'}</div>`;
      
      case 'button':
        return `
          <div style="margin: 32px 0; text-align: ${block.content.align || 'center'};">
            <a href="${block.content.url || '#'}" 
               style="background-color: ${block.content.color || PRIMARY_GREEN}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-family: sans-serif; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ${block.content.text || 'Click Here'}
            </a>
          </div>`;
      
      case 'social':
        return `
          <div style="margin: 32px 0; text-align: center; padding-top: 24px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 14px; color: #64748b; margin-bottom: 16px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px;">Connect with us</p>
            <div style="display: inline-block;">
              ${(block.content.platforms || []).map((p: any) => `
                <a href="${p.url}" style="margin: 0 12px; text-decoration: none; color: ${PRIMARY_GREEN}; font-weight: 600; font-family: sans-serif; font-size: 14px;">${p.name}</a>
              `).join('')}
            </div>
          </div>`;
      
      case 'divider':
        return `<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />`;
      
      case 'spacer':
        return `<div style="height: ${block.content.height || '20'}px;"></div>`;
      
      case 'list':
        return `
          <ul style="${styleString}; padding-left: 20px;">
            ${(block.content.items || []).filter((i: string) => i.trim()).map((item: string) => `<li style="margin-bottom: 10px;">${item}</li>`).join('')}
          </ul>`;

      case 'footer':
        return `
          <div style="background-color: ${LIGHT_BG}; padding: 32px; border-radius: 8px; margin-top: 40px; text-align: center; border: 1px solid #e2e8f0;">
            <p style="color: ${PRIMARY_GREEN}; font-weight: bold; margin-bottom: 8px; font-family: sans-serif;">Gambia Biodiversity Management</p>
            <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0; font-family: sans-serif;">
              Protecting and preserving the natural heritage of The Gambia for future generations.<br>
              © ${new Date().getFullYear()} NBSAP Gambia. All rights reserved.
            </p>
          </div>`;
      
      default:
        return '';
    }
  }).join('\n');
};

// --- Sortable Item Component ---

const SortableBlock = ({ 
  block, 
  isSelected, 
  onSelect, 
  onDelete 
}: { 
  block: EmailBlock; 
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderPreview = () => {
    const commonStyle = {
      textAlign: block.content.align || 'left',
      fontWeight: block.content.bold ? 'bold' : 'normal',
      fontStyle: block.content.italic ? 'italic' : 'normal',
      color: block.content.color || (block.type === 'heading' ? PRIMARY_GREEN : TEXT_COLOR),
      fontSize: block.content.fontSize === 'sm' ? '0.75rem' : 
                block.content.fontSize === 'lg' ? '1.125rem' : 
                block.content.fontSize === 'xl' ? '1.5rem' : '0.875rem',
    };

    switch (block.type) {
      case 'heading':
        return (
          <div 
            style={commonStyle as any} 
            className="font-bold"
            dangerouslySetInnerHTML={{ __html: block.content.text || 'Heading' }}
          />
        );
      case 'text':
        return (
          <div 
            style={commonStyle as any} 
            className="line-clamp-3"
            dangerouslySetInnerHTML={{ __html: block.content.text || 'Empty text block' }}
          />
        );
      case 'button':
        return (
          <div className="py-2" style={{ textAlign: block.content.align || 'center' }}>
            <div 
              className="inline-block px-6 py-2 rounded shadow-sm text-xs font-semibold text-white"
              style={{ backgroundColor: block.content.color || PRIMARY_GREEN }}
            >
              {block.content.text || 'Button'}
            </div>
          </div>
        );
      case 'social':
        return (
          <div className="flex justify-center gap-4 py-2 border-t border-gray-100 mt-2 pt-4">
            {block.content.platforms?.map((p: any, i: number) => (
              <span key={i} className="text-[10px] font-bold text-[#2d5a47]">{p.name}</span>
            ))}
          </div>
        );
      case 'divider':
        return <div className="border-t border-gray-200 my-2" />;
      case 'spacer':
        return <div className="bg-gray-50 border border-dashed border-gray-200 rounded h-8 flex items-center justify-center text-[10px] text-gray-400">Spacer ({block.content.height}px)</div>;
      case 'list':
        return (
          <ul 
            style={commonStyle as any}
            className="list-disc list-inside space-y-1"
          >
            {block.content.items?.slice(0, 2).map((item: string, i: number) => (
              <li key={i} className="truncate">{item}</li>
            ))}
            {block.content.items?.length > 2 && <li className="list-none italic opacity-50">...and {block.content.items.length - 2} more</li>}
          </ul>
        );
      case 'footer':
        return (
          <div className="bg-slate-50 p-3 rounded border border-slate-100 text-center">
            <div className="text-[10px] font-bold text-[#2d5a47] mb-1">Gambia Biodiversity</div>
            <div className="text-[8px] text-slate-400">Standard Organization Footer</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative mb-3 rounded-xl border p-4 transition-all cursor-pointer ${
        isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/30 bg-white'
      } shadow-sm`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="flex items-start gap-3">
        <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5">
              {block.type === 'heading' && <Type size={10} className="text-primary" />}
              {block.type === 'text' && <Type size={10} />}
              {block.type === 'button' && <Square size={10} />}
              {block.type === 'social' && <Share2 size={10} />}
              {block.type === 'divider' && <Minus size={10} />}
              {block.type === 'list' && <ListIcon size={10} />}
              {block.type === 'footer' && <LayoutIcon size={10} />}
              {block.type}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 p-1 rounded-full transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

// --- Main Builder Component ---

export function EmailBuilder({ 
  initialHtml, 
  onChange, 
  templateData, 
  onTemplateDataChange,
  onSave,
  onCancel,
  isSaving
}: EmailBuilderProps) {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'blocks' | 'settings'>('blocks');

  // Initialize blocks from HTML
  useEffect(() => {
    if (initialHtml && blocks.length === 0) {
      // Try to find the persistence comment
      const match = initialHtml.match(/<!-- BUILDER_STATE: (.*) -->/);
      if (match && match[1]) {
        try {
          const savedBlocks = JSON.parse(match[1]);
          setBlocks(savedBlocks);
          return;
        } catch (e) {
          console.error("Failed to parse saved blocks", e);
        }
      }

      // Fallback: put everything in one text block if it's not empty
      if (initialHtml.trim()) {
        // Clean up any existing comments if we're falling back
        const cleanHtml = initialHtml.replace(/<!-- BUILDER_STATE: .* -->/g, '').trim();
        setBlocks([
          {
            id: 'initial-text',
            type: 'text',
            content: { text: cleanHtml }
          }
        ]);
      }
    }
  }, [initialHtml]);

  // Update parent whenever blocks change
  useEffect(() => {
    const html = generateHtmlFromBlocks(blocks);
    // Store blocks as JSON in a hidden comment for persistence
    const persistenceComment = `\n\n<!-- BUILDER_STATE: ${JSON.stringify(blocks)} -->`;
    onChange(html + persistenceComment);
  }, [blocks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addBlock = (type: BlockType) => {
    const newId = `block-${Date.now()}`;
    let content: any = {
      align: 'left',
      bold: false,
      italic: false,
      fontSize: 'base',
      color: type === 'heading' ? PRIMARY_GREEN : TEXT_COLOR
    };

    switch (type) {
      case 'heading':
        content.text = 'New Heading';
        content.fontSize = 'xl';
        break;
      case 'text':
        content.text = 'New text block. Add your content here...';
        break;
      case 'button':
        content.text = 'Take Action';
        content.url = 'https://';
        content.align = 'center';
        break;
      case 'social':
        content.platforms = [
          { name: 'Facebook', url: '#' },
          { name: 'Twitter', url: '#' },
          { name: 'Instagram', url: '#' }
        ];
        break;
      case 'divider':
        break;
      case 'spacer':
        content.height = '32';
        break;
      case 'list':
        content.items = ['First item', 'Second item', 'Third item'];
        break;
      case 'footer':
        break;
    }

    const newBlock: EmailBlock = { id: newId, type, content };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newId);
    setActiveTab('blocks');
  };

  const updateBlockContent = (id: string, newContent: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...newContent } } : b));
  };

  const applyInlineStyle = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    // The RichTextEditor's onInput will handle the state update
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="fixed inset-0 z-[100] bg-background text-foreground flex flex-col overflow-hidden dark">
      {/* Top Bar */}
      <div className="h-16 border-b bg-card px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onCancel} className="hover:bg-muted">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="font-bold text-sm leading-none">{templateData.name || 'Untitled Template'}</h2>
            <p className="text-[10px] text-muted-foreground mt-1">Editing Email Template</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onCancel} className="border-muted-foreground/20 hover:bg-muted">Cancel</Button>
          <Button size="sm" onClick={onSave} disabled={isSaving} className="bg-primary text-primary-foreground hover:opacity-90">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Template
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Components */}
        <div className="w-72 border-r bg-background flex flex-col shrink-0">
          <div className="p-4 border-b bg-card">
            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="blocks" className="data-[state=active]:bg-background">Blocks</TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-background">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === 'blocks' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Content Elements</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="flex flex-col h-20 gap-2 bg-card border-muted hover:border-primary hover:bg-primary/5 transition-colors" onClick={() => addBlock('heading')}>
                      <Type size={20} className="text-primary" />
                      <span className="text-[10px] font-medium">Heading</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2 bg-card border-muted hover:border-primary hover:bg-primary/5 transition-colors" onClick={() => addBlock('text')}>
                      <Type size={20} />
                      <span className="text-[10px] font-medium">Text</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2 bg-card border-muted hover:border-primary hover:bg-primary/5 transition-colors" onClick={() => addBlock('button')}>
                      <Square size={20} />
                      <span className="text-[10px] font-medium">Button</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2 bg-card border-muted hover:border-primary hover:bg-primary/5 transition-colors" onClick={() => addBlock('list')}>
                      <ListIcon size={20} />
                      <span className="text-[10px] font-medium">List</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Layout & Structure</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="flex flex-col h-20 gap-2 bg-card border-muted hover:border-primary hover:bg-primary/5 transition-colors" onClick={() => addBlock('social')}>
                      <Share2 size={20} />
                      <span className="text-[10px] font-medium">Social</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2 bg-card border-muted hover:border-primary hover:bg-primary/5 transition-colors" onClick={() => addBlock('footer')}>
                      <LayoutIcon size={20} />
                      <span className="text-[10px] font-medium">Footer</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2 bg-card border-muted hover:border-primary hover:bg-primary/5 transition-colors" onClick={() => addBlock('divider')}>
                      <Minus size={20} />
                      <span className="text-[10px] font-medium">Divider</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2 bg-card border-muted hover:border-primary hover:bg-primary/5 transition-colors" onClick={() => addBlock('spacer')}>
                      <Settings2 size={20} />
                      <span className="text-[10px] font-medium">Spacer</span>
                    </Button>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-4 text-destructive hover:text-destructive hover:bg-destructive/10 text-[10px] uppercase tracking-wider font-bold"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all blocks?')) {
                      setBlocks([]);
                      setSelectedBlockId(null);
                    }
                  }}
                >
                  <Trash2 size={12} className="mr-2" /> Clear Canvas
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Template Name</Label>
                  <Input 
                    value={templateData.name} 
                    onChange={(e) => onTemplateDataChange({ ...templateData, name: e.target.value })}
                    className="bg-card border-muted h-8 text-sm focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Textarea 
                    value={templateData.description} 
                    onChange={(e) => onTemplateDataChange({ ...templateData, description: e.target.value })}
                    className="bg-card border-muted text-sm focus:ring-primary"
                    rows={3}
                  />
                </div>
                <div className="space-y-2 pt-4 border-t border-muted">
                  <Label className="text-xs text-muted-foreground">Email Subject</Label>
                  <Input 
                    value={templateData.subject} 
                    onChange={(e) => onTemplateDataChange({ ...templateData, subject: e.target.value })}
                    className="bg-card border-muted h-8 text-sm focus:ring-primary"
                    placeholder="Use {{placeholders}}"
                  />
                  <p className="text-[10px] text-muted-foreground italic">
                    Available: {"{{name}}, {{target_name}}, {{subject}}"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 bg-muted/30 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden min-h-full flex flex-col">
            {/* Gmail-style Header */}
            <div className="bg-[#f2f6fc] px-6 py-4 border-b flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2d5a47] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    GB
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">Gambia Biodiversity Team</span>
                    <span className="text-xs text-slate-500">&lt;noreply@nbsap.gm&gt;</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="flex flex-col gap-1 border-t border-slate-200/60 pt-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500 w-12">To:</span>
                  <span className="text-slate-900 font-medium">Visitor Name &lt;visitor@example.com&gt;</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500 w-12">Subject:</span>
                  <span className="text-[#1a73e8] font-medium">{templateData.subject || '(No Subject)'}</span>
                </div>
              </div>
            </div>

            {/* Email Content Area */}
            <div className="flex-1 bg-white">
              {/* Header Branding */}
              <div className="p-10 text-center border-b border-slate-50">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d5a47]/5 rounded-full">
                  <div className="w-6 h-6 bg-[#2d5a47] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-[#2d5a47] uppercase tracking-widest">NBSAP Gambia</span>
                </div>
              </div>

              <div className="p-10">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={blocks.map(b => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {blocks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-32 text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl">
                        <Plus className="mb-4 opacity-20" size={48} />
                        <p className="text-sm font-medium">Start building your email</p>
                        <p className="text-xs">Drag components from the left sidebar</p>
                      </div>
                    ) : (
                      blocks.map((block) => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          isSelected={selectedBlockId === block.id}
                          onSelect={() => setSelectedBlockId(block.id)}
                          onDelete={() => deleteBlock(block.id)}
                        />
                      ))
                    )}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
            
            {/* Gmail-style Footer Actions */}
            <div className="px-6 py-4 bg-white border-t flex items-center gap-3">
              <div className="px-6 py-2 bg-[#1a73e8] text-white rounded-full text-sm font-medium shadow-sm opacity-50 cursor-not-allowed">
                Send
              </div>
              <div className="flex items-center gap-4 text-slate-500 ml-4">
                <Type size={18} />
                <Share2 size={18} />
                <Plus size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Properties & Preview */}
        <div className="w-80 border-l bg-background flex flex-col shrink-0 overflow-hidden">
          <Tabs defaultValue="properties" className="flex flex-col h-full">
            <div className="p-4 border-b bg-card shrink-0">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="properties" className="data-[state=active]:bg-background">Properties</TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-background">Preview</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="properties" className="m-0 p-4">
                {selectedBlock ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> {selectedBlock.type} Settings
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {/* Formatting Toolbar for Text-based blocks */}
                      {(selectedBlock.type === 'text' || selectedBlock.type === 'heading' || selectedBlock.type === 'button') && (
                        <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-muted/50">
                          <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Formatting</Label>
                          
                          <div className="flex flex-wrap gap-2">
                            {/* Alignment (Block Level) */}
                            <div className="flex bg-card rounded-lg border border-muted p-1">
                              <Button 
                                variant={selectedBlock.content.align === 'left' ? 'secondary' : 'ghost'} 
                                size="icon" className="h-8 w-8"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => updateBlockContent(selectedBlock.id, { align: 'left' })}
                              >
                                <AlignLeft size={14} />
                              </Button>
                              <Button 
                                variant={selectedBlock.content.align === 'center' ? 'secondary' : 'ghost'} 
                                size="icon" className="h-8 w-8"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => updateBlockContent(selectedBlock.id, { align: 'center' })}
                              >
                                <AlignCenter size={14} />
                              </Button>
                              <Button 
                                variant={selectedBlock.content.align === 'right' ? 'secondary' : 'ghost'} 
                                size="icon" className="h-8 w-8"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => updateBlockContent(selectedBlock.id, { align: 'right' })}
                              >
                                <AlignRight size={14} />
                              </Button>
                            </div>

                            {/* Inline Styles (Selection Based) */}
                            <div className="flex bg-card rounded-lg border border-muted p-1">
                              <Button 
                                variant="ghost" 
                                size="icon" className="h-8 w-8"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => applyInlineStyle('bold')}
                                title="Bold Selection"
                              >
                                <Bold size={14} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" className="h-8 w-8"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => applyInlineStyle('italic')}
                                title="Italic Selection"
                              >
                                <Italic size={14} />
                              </Button>
                            </div>

                            {/* Font Size (Block Level) */}
                            <div className="flex bg-card rounded-lg border border-muted p-1">
                              {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
                                <Button 
                                  key={size}
                                  variant={selectedBlock.content.fontSize === size ? 'secondary' : 'ghost'} 
                                  size="sm" className="h-8 px-2 text-[10px] font-bold uppercase"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => updateBlockContent(selectedBlock.id, { fontSize: size })}
                                >
                                  {size}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Color Palette (Selection Based) */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Palette size={12} className="text-muted-foreground" />
                              <span className="text-[10px] uppercase text-muted-foreground font-bold">Color Selection</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {[PRIMARY_GREEN, SECONDARY_GOLD, TEXT_COLOR, '#ef4444', '#3b82f6', '#000000'].map((color) => (
                                <button
                                  key={color}
                                  className="w-6 h-6 rounded-full border border-muted transition-transform hover:scale-110"
                                  style={{ backgroundColor: color }}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => applyInlineStyle('foreColor', color)}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Content Inputs */}
                      {(selectedBlock.type === 'text' || selectedBlock.type === 'heading') && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Content</Label>
                          <RichTextEditor 
                            value={selectedBlock.content.text} 
                            onChange={(val) => updateBlockContent(selectedBlock.id, { text: val })}
                            placeholder={selectedBlock.type === 'heading' ? "Enter heading..." : "Enter your message here..."}
                            className={selectedBlock.type === 'heading' ? "min-h-[80px] font-bold text-lg" : ""}
                          />
                          <p className="text-[10px] text-muted-foreground italic">
                            Select text to apply bold, italic, or colors to specific words.
                          </p>
                        </div>
                      )}

                      {selectedBlock.type === 'button' && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Button Text</Label>
                            <Input 
                              value={selectedBlock.content.text} 
                              onChange={(e) => updateBlockContent(selectedBlock.id, { text: e.target.value })}
                              className="bg-card border-muted focus:border-primary transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">URL</Label>
                            <Input 
                              value={selectedBlock.content.url} 
                              onChange={(e) => updateBlockContent(selectedBlock.id, { url: e.target.value })}
                              placeholder="https://..."
                              className="bg-card border-muted focus:border-primary transition-colors"
                            />
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'spacer' && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Height (px)</Label>
                          <Input 
                            type="number"
                            value={selectedBlock.content.height} 
                            onChange={(e) => updateBlockContent(selectedBlock.id, { height: e.target.value })}
                            className="bg-card border-muted focus:border-primary transition-colors"
                          />
                        </div>
                      )}

                      {selectedBlock.type === 'list' && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">List Items (one per line)</Label>
                          <Textarea 
                            value={selectedBlock.content.items?.join('\n')} 
                            onChange={(e) => updateBlockContent(selectedBlock.id, { items: e.target.value.split('\n') })}
                            rows={8}
                            className="bg-card border-muted focus:border-primary transition-colors"
                          />
                        </div>
                      )}

                      {selectedBlock.type === 'social' && (
                        <div className="space-y-4">
                          {selectedBlock.content.platforms.map((p: any, idx: number) => (
                            <div key={idx} className="space-y-1 border-b border-muted pb-3 last:border-0">
                              <Label className="text-[10px] uppercase text-muted-foreground font-bold">{p.name}</Label>
                              <Input 
                                value={p.url} 
                                onChange={(e) => {
                                  const newPlatforms = [...selectedBlock.content.platforms];
                                  newPlatforms[idx] = { ...p, url: e.target.value };
                                  updateBlockContent(selectedBlock.id, { platforms: newPlatforms });
                                }}
                                className="h-8 text-xs bg-card border-muted focus:border-primary transition-colors"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedBlock.type === 'footer' && (
                        <div className="p-4 bg-muted/50 rounded-lg border border-muted">
                          <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                            The footer uses the organization's standard branding and current year. It is automatically updated to maintain consistency.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground/30">
                    <Settings2 size={48} className="mb-4 opacity-10" />
                    <p className="text-sm font-medium">No element selected</p>
                    <p className="text-xs">Click an element on the canvas to edit its properties</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="preview" className="m-0 h-full bg-muted/30 p-4">
                <div className="bg-white shadow-sm rounded border h-full overflow-y-auto p-4">
                  <div 
                    className="email-content scale-[0.8] origin-top"
                    dangerouslySetInnerHTML={{ __html: generateHtmlFromBlocks(blocks) }} 
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}


