import React, { useState, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import './TextEditor.css';

import AutoLaTeX from 'react-autolatex';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';


// Register the module
Quill.register('modules/imageResize', ImageResize);
const Block = Quill.import('blots/block');
Block.tagName = 'div';
Quill.register(Block, true);


export default function TextEditorWidget2 (props) {

    let  editorHtml = props.value !== undefined ? props.value : '';

    const [viewable, setViewable] = useState(false);

    const quillRef = useRef();


    const handleChange = (html) => {
        editorHtml = html;
        // setState({ ...state, editorHtml: html, isChanged: true });
    };
    const formats = ['header', 'font', 'color', 'align', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video', 'formula', 'width'];

    // const keyboardBindings = {
    //     linebreak: {
    //         key: 13,
    //         handler: function (range, _context) {
    //             this.quill.clipboard.dangerouslyPasteHTML(
    //                 range.index,
    //                 "<p><br/><br/></p>"
    //             );
    //         }
    //     },
    // };

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }, { color: [] }, { align: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link', 'image', 'video', 'formula'],
            ['clean'],
        ],
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
        },
        clipboard: {
            matchVisual: false,
        },
    };

    const mods = {
        ...modules,
        // keyboard: {
        //     bindings: keyboardBindings
        // }
    };

    if (viewable && !props.value && props.isOverlay) {
        return (
            <div
                className="viewable-editor editor-new"
                    onClick={() => {
                        if (!props.disabled) {
                            setViewable(false);
                            props.openEditor(true);
                        }
                    }}
                >
                <span>{props.placeholder}</span>
            </div>
        );
    }

    if (viewable && props.value && props.value.trim() !== '' && props.value.trim() !== '<div><br></div>') {
        return (
            <div className="viewable-editor">
                <div className="viewable-content">
                    <AutoLaTeX>{props.value}</AutoLaTeX>
                </div>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        if (!props.disabled) {
                            setViewable(false);
                            props.openEditor(true);
                        }
                    }}
                >
                    <EditOutlined title="Chỉnh sửa" />
                </Button>
            </div>
        );
    }


    return (
        <div
            className={`text-quill-custom 
                ${props.isOverlay ? 'overlay-editor' : ''} 
                ${props.isSimple ? 'simple-editor' : ''} 
                ${props.showToolbar ? 'show-toolbar-editor' : ''} 
                ${props.isMinHeight200 ? 'min-height-200' : ''}
                ${props.isMinHeight300 ? 'min-height-300' : ''}
                ${props.isMinHeight500 ? 'min-height-500' : ''}
            `}
            onMouseLeave={() => {
                props.onChange(editorHtml);
            }}
        >
        
        {!props.disabled && (
            <ReactQuill 
                ref={quillRef}
                theme={'snow'}
                onChange={handleChange}
                value={editorHtml}
                formats={formats}
                modules={mods}
                bounds={'.app'}
                disabled={props.disabled}
                placeholder={props.placeholder}
            />
        )}       
        </div>
    );
};

// export default TextEditorWidget2;
