import React, { useState, useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import './TextEditor.css';
import 'react-quill/dist/quill.snow.css';

// component
import { Button, Tabs, Upload, message, Image } from 'antd';
import { FunctionOutlined, CameraOutlined } from '@ant-design/icons';
import MathJax from 'react-mathjax';
import config from '../../../configs/index';

import icon1 from 'assets/img/math-icons/1.png';
import icon2 from 'assets/img/math-icons/2.png';
import icon3 from 'assets/img/math-icons/3.png';

import icon4 from 'assets/img/math-icons/4.png';
import icon5 from 'assets/img/math-icons/5.png';
import icon6 from 'assets/img/math-icons/6.png';

import icon7 from 'assets/img/math-icons/7.png';
import icon8 from 'assets/img/math-icons/8.png';
import icon9 from 'assets/img/math-icons/9.png';

import icon10 from 'assets/img/math-icons/10.png';
import icon11 from 'assets/img/math-icons/11.png';
import icon12 from 'assets/img/math-icons/12.png';

import icon13 from 'assets/img/math-icons/13.png';
import icon14 from 'assets/img/math-icons/14.png';

const { TabPane } = Tabs;
Quill.register('modules/imageResize', ImageResize);

const TextEditorWidget = (props) => {
    const quillRef = useRef();
    const regex = /\\begin{center}\\includegraphics\[scale = 0\.5\]{(.*?)}\\end{center}/;
    // const regexImg = /\\begin{center}\\includegraphics\[scale&nbsp;=&nbsp;0.5]{(.*?)}\\end{center}/;

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const [state, setState] = useState({
        editorHtml: '',
        viewEditor: '',
        theme: 'snow',
        fileImg: ''
    });
    
    // props upload image
    const propsImage = {
        name: 'file',
        action: '#',
  
        beforeUpload: file => {
          const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
          if (!isPNG) {
            message.error(`${file.name} có định dạng không phải là png/jpg`);
          }
          return isPNG || Upload.LIST_IGNORE;
        },
  
        onChange(info) {
            if (info.file.status === 'done') {
                quillRef.current.focus();
                setState({ ...state, fileImg: info.file.originFileObj });
                setMedia({ ...media, visible: false });
                const editor = quillRef.current.getEditor();
            
                getBase64(info.file.originFileObj, (url) => {
                    editor.insertEmbed(editor.getSelection().index + 1, 'image', url);
                    editor.pasteHTML(editor.getSelection().index + 1, <img src={url} class="exam-image" alt="exam" />);
                });
            }
        },
  
        async customRequest(options) {
          const { onSuccess } = options;
    
          setTimeout(() => {
            onSuccess("ok");
          }, 0);
        },
  
        onRemove(e) {
            setState({ ...state, fileImg: '' }); 
        },
    };

    const [media, setMedia] = useState({
        visible: false,
    });
    const [text, setText] = useState('');
    const [math, setMath] = useState({
        visible: false,
    });

    const formats = ['header', 'font', 'color', 'align', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video', 'formula', 'width'];

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

    const setFormula = (type) => {
        if (type === 1) setText(`$^{2}$`);
        if (type === 2) setText(`$\\sqrt[n]{x}$`);
        if (type === 3) setText('$\\frac{x}{y}$');
        if (type === 4) setText('$x_{123}$');
        if (type === 5) setText('$\\leq$');
        if (type === 6) setText('$\\geq$');
        if (type === 7) setText('$\\neq$');
        if (type === 8) setText('$\\pi$');
        if (type === 9) setText('$\\alpha$');
        if (type === 10) setText('$\\left \\{ {{y=2} \\atop {x=2}} \\right.$');
        if (type === 11) setText('\\(\\left[ \\begin{array}{l}x=2\\\\x=-1\\end{array} \\right.\\)');
        if (type === 12) setText('$\\int\\limits^a_b {x} \\, dx$');
        if (type === 13) setText('$\\lim_{n \\to \\infty} a_n$');
        if (type === 14) setText('$\\left[\\begin{array}{ccc}1&2&3\\\\4&5&6\\\\7&8&9\\end{array}\\right]$');
    };
    
    useEffect(() => {
        let value = props.valueParent?.split('\n').join('<br>');
        setState({ ...state, editorHtml: value, viewEditor: props.valueParent });
    }, [props.valueParent]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (text !== '') {
            setState({ ...state, editorHtml: `${state.editorHtml} ${text}` });
            setText('');
        }
    }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
    
    return (
        <>
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
                    let html = quillRef.current.getEditor().root.innerHTML;
                    let value = '';
                    const divContentRegex = /<div[^>]*>(.*?)<\/div>/g;
                    const matches = html.match(divContentRegex);
                    if (matches) {
                        matches.forEach((match) => {
                            let content = match.replace(/<\/?div[^>]*>/g, ''); // Remove <div> tags
                            content = content.replace('&gt;', '>');
                            content = content.replace('&lt;', '<');
                            content = content.replace('&amp;', '&');
                            if (content.trim() !== '<br>') value += content.trim() + '\n';
                        });
                    };
                    setState({ ...state, editorHtml: html, viewEditor: value })
                    props.onChange(value)
                }}
            >
                {!props.disabled && (
                    <ReactQuill
                        ref={quillRef}
                        theme='snow'
                        value={state.editorHtml || ''}
                        formats={formats}
                        modules={modules}
                        bounds={'.app'}
                        disabled={props.disabled}
                        placeholder={props.placeholder}
                    />
                )}

                {props.isSimple && !props.disabled && (
                    <div className="simple-extra-actions">
                        {props.isUpload && (
                            <Upload {...propsImage} maxCount={1} showUploadList={false}>
                                <Button
                                    className="add-image"
                                    type="link"
                                    size="small"
                                    title="Chèn hình ảnh"
                                    onClick={() =>
                                        setMedia({
                                        ...media,
                                        visible: true,
                                        })
                                    }
                                >
                                    <CameraOutlined />
                                </Button>
                            </Upload>
                        )}
                        <Button
                            className={math.visible ? 'active add-image' : 'add-image'}
                            type="link"
                            title="Chèn công thức"
                            size="small"
                            onClick={() =>
                            setMath({
                                ...math,
                                visible: !math.visible,
                            })
                            }
                        >
                            <FunctionOutlined />
                        </Button>
                    </div>
                )}
            </div>
            {(math.visible || props.disabled) && (
                <div className='math-area'>
                    {math.visible && (
                        <div className="math-options">
                            <div className="body-math">
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="Công thức toán" key="1">
                                        <img src={icon1} onClick={() => setFormula(1)} alt="icon"/>
                                        <img src={icon2} onClick={() => setFormula(2)} alt="icon"/>
                                        <img src={icon3} onClick={() => setFormula(3)} alt="icon"/>
                                        <img src={icon4} onClick={() => setFormula(4)} alt="icon"/>
                                        <img src={icon5} onClick={() => setFormula(5)} alt="icon"/>
                                        <img src={icon6} onClick={() => setFormula(6)} alt="icon"/>
                                        <img src={icon7} onClick={() => setFormula(7)} alt="icon"/>
                                        <img src={icon8} onClick={() => setFormula(8)} alt="icon"/>
                                        <img src={icon9} onClick={() => setFormula(9)} alt="icon"/>
                                        <img src={icon10} onClick={() => setFormula(10)} alt="icon"/>
                                        <img src={icon11} onClick={() => setFormula(11)} alt="icon"/>
                                        <img src={icon12} onClick={() => setFormula(12)} alt="icon"/>
                                        <img src={icon13} onClick={() => setFormula(13)} alt="icon"/>
                                        <img src={icon14} onClick={() => setFormula(14)} alt="icon"/>
                                    </TabPane>
                                    <TabPane tab="Ký tự đặc biệt" key="2">
                                        <ul className="math-symbols">
                                            <li onClick={() => setText('²')}>
                                                <span>²</span>
                                            </li>
                                            <li onClick={() => setText('³')}>
                                                <span>³</span>
                                            </li>
                                            <li onClick={() => setText('√')}>
                                                <span>√</span>
                                            </li>
                                            <li onClick={() => setText('∛')}>
                                                <span>∛</span>
                                            </li>
                                            <li onClick={() => setText('·')}>
                                                <span>·</span>
                                            </li>
                                            <li onClick={() => setText('×')}>
                                                <span>×</span>
                                            </li>
                                            <li onClick={() => setText('÷')}>
                                                <span>÷</span>
                                            </li>
                                            <li onClick={() => setText('±')}>
                                                <span>±</span>
                                            </li>
                                            <li onClick={() => setText('≈')}>
                                                <span>≈</span>
                                            </li>
                                            <li onClick={() => setText('≤')}>
                                                <span>≤</span>
                                            </li>
                                            <li onClick={() => setText('≥')}>
                                                <span>≥</span>
                                            </li>
                                            <li onClick={() => setText('≡')}>
                                                <span>≡</span>
                                            </li>
                                            <li onClick={() => setText('⇒')}>
                                                <span>⇒</span>
                                            </li>
                                            <li onClick={() => setText('⇔')}>
                                                <span>⇔</span>
                                            </li>
                                            <li onClick={() => setText('∈')}>
                                                <span>∈</span>
                                            </li>
                                            <li onClick={() => setText('∉')}>
                                                <span>∉</span>
                                            </li>
                                            <li onClick={() => setText('∧')}>
                                                <span>∧</span>
                                            </li>
                                            <li onClick={() => setText('∨')}>
                                                <span>∨</span>
                                            </li>
                                            <li onClick={() => setText('∞')}>
                                                <span>∞</span>
                                            </li>
                                            <li onClick={() => setText('Δ')}>
                                                <span>Δ</span>
                                            </li>
                                            <li onClick={() => setText('π')}>
                                                <span>π</span>
                                            </li>
                                            <li onClick={() => setText('Ф')}>
                                                <span>Ф</span>
                                            </li>
                                            <li onClick={() => setText('ω')}>
                                                <span>ω</span>
                                            </li>
                                            <li onClick={() => setText('↑')}>
                                                <span>↑</span>
                                            </li>
                                            <li onClick={() => setText('↓')}>
                                                <span>↓</span>
                                            </li>
                                            <li onClick={() => setText('∵')}>
                                                <span>∵</span>
                                            </li>
                                            <li onClick={() => setText('∴')}>
                                                <span>∴</span>
                                            </li>
                                            <li onClick={() => setText('↔')}>
                                                <span>↔</span>
                                            </li>
                                            <li onClick={() => setText('→')}>
                                                <span>→</span>
                                            </li>
                                            <li onClick={() => setText('←')}>
                                                <span>←</span>
                                            </li>
                                            <li onClick={() => setText('⇵')}>
                                                <span>⇵</span>
                                            </li>
                                            <li onClick={() => setText('⇅')}>
                                                <span>⇅</span>
                                            </li>
                                            <li onClick={() => setText('⇄')}>
                                                <span>⇄</span>
                                            </li>
                                            <li onClick={() => setText('⇆')}>
                                                <span>⇆</span>
                                            </li>
                                            <li onClick={() => setText('∫')}>
                                                <span>∫</span>
                                            </li>
                                            <li onClick={() => setText('∑')}>
                                                <span>∑</span>
                                            </li>
                                            <li onClick={() => setText('⊂')}>
                                                <span>⊂</span>
                                            </li>
                                            <li onClick={() => setText('⊃')}>
                                                <span>⊃</span>
                                            </li>
                                            <li onClick={() => setText('⊆')}>
                                                <span>⊆</span>
                                            </li>
                                            <li onClick={() => setText('⊇')}>
                                                <span>⊇</span>
                                            </li>
                                            <li onClick={() => setText('⊄')}>
                                                <span>⊄</span>
                                            </li>
                                            <li onClick={() => setText('⊅')}>
                                                <span>⊅</span>
                                            </li>
                                            <li onClick={() => setText('∀')}>
                                                <span>∀</span>
                                            </li>
                                            <li onClick={() => setText('∠')}>
                                                <span>∠</span>
                                            </li>
                                            <li onClick={() => setText('∡')}>
                                                <span>∡</span>
                                            </li>
                                            <li onClick={() => setText('⊥')}>
                                                <span>⊥</span>
                                            </li>
                                            <li onClick={() => setText('∪')}>
                                                <span>∪</span>
                                            </li>
                                            <li onClick={() => setText('∩')}>
                                                <span>∩</span>
                                            </li>
                                            <li onClick={() => setText('∅')}>
                                                <span>∅</span>
                                            </li>
                                            <li onClick={() => setText('¬')}>
                                                <span>¬</span>
                                            </li>
                                            <li onClick={() => setText('⊕')}>
                                                <span>⊕</span>
                                            </li>
                                            <li onClick={() => setText('║')}>
                                                <span>║</span>
                                            </li>
                                            <li onClick={() => setText('∦')}>
                                                <span>∦</span>
                                            </li>
                                            <li onClick={() => setText('∝')}>
                                                <span>∝</span>
                                            </li>
                                            <li onClick={() => setText('㏒')}>
                                                <span>㏒</span>
                                            </li>
                                            <li onClick={() => setText('㏑')}>
                                                <span>㏑</span>
                                            </li>
                                        </ul>
                                    </TabPane>
                                    <TabPane tab="Phiên âm tiếng anh" key="3">
                                        <ul className="math-symbols">
                                            <li onClick={() => setText('i:')}>
                                                <span>i:</span>
                                            </li>
                                            <li onClick={() => setText('ɪ')}>
                                                <span>ɪ</span>
                                            </li>
                                            <li onClick={() => setText('ʊ')}>
                                                <span>ʊ</span>
                                            </li>
                                            <li onClick={() => setText('u:')}>
                                                <span>u:</span>
                                            </li>
                                            <li onClick={() => setText('ɪə')}>
                                                <span>ɪə</span>
                                            </li>
                                            <li onClick={() => setText('eɪ')}>
                                                <span>eɪ</span>
                                            </li>
                                            <li onClick={() => setText('e')}>
                                                <span>e</span>
                                            </li>
                                            <li onClick={() => setText('ə')}>
                                                <span>ə</span>
                                            </li>
                                            <li onClick={() => setText('3:')}>
                                                <span>3:</span>
                                            </li>
                                            <li onClick={() => setText('ɔ:')}>
                                                <span>ɔ:</span>
                                            </li>
                                            <li onClick={() => setText('ʊə')}>
                                                <span>ʊə</span>
                                            </li>
                                            <li onClick={() => setText('ɔɪ')}>
                                                <span>ɔɪ</span>
                                            </li>
                                            <li onClick={() => setText('əʊ')}>
                                                <span>əʊ</span>
                                            </li>
                                            <li onClick={() => setText('æ')}>
                                                <span>æ</span>
                                            </li>
                                            <li onClick={() => setText('ʌ')}>
                                                <span>ʌ</span>
                                            </li>
                                            <li onClick={() => setText('ɑ:')}>
                                                <span>ɑ:</span>
                                            </li>
                                            <li onClick={() => setText('ɒ')}>
                                                <span>ɒ</span>
                                            </li>
                                            <li onClick={() => setText('eə')}>
                                                <span>eə</span>
                                            </li>
                                            <li onClick={() => setText('aɪ')}>
                                                <span>aɪ</span>
                                            </li>
                                            <li onClick={() => setText('aʊ')}>
                                                <span>aʊ</span>
                                            </li>
                                            <li onClick={() => setText('p')}>
                                                <span>p</span>
                                            </li>
                                            <li onClick={() => setText('b')}>
                                                <span>b</span>
                                            </li>
                                            <li onClick={() => setText('t')}>
                                                <span>t</span>
                                            </li>
                                            <li onClick={() => setText('d')}>
                                                <span>d</span>
                                            </li>
                                            <li onClick={() => setText('tʃ')}>
                                                <span>tʃ</span>
                                            </li>
                                            <li onClick={() => setText('dʒ')}>
                                                <span>dʒ</span>
                                            </li>
                                            <li onClick={() => setText('k')}>
                                                <span>k</span>
                                            </li>
                                            <li onClick={() => setText('g')}>
                                                <span>g</span>
                                            </li>
                                            <li onClick={() => setText('f')}>
                                                <span>f</span>
                                            </li>
                                            <li onClick={() => setText('v')}>
                                                <span>v</span>
                                            </li>
                                            <li onClick={() => setText('θ')}>
                                                <span>θ</span>
                                            </li>
                                            <li onClick={() => setText('ð')}>
                                                <span>ð</span>
                                            </li>
                                            <li onClick={() => setText('s')}>
                                                <span>s</span>
                                            </li>
                                            <li onClick={() => setText('z')}>
                                                <span>z</span>
                                            </li>
                                            <li onClick={() => setText('ʃ')}>
                                                <span>ʃ</span>
                                            </li>
                                            <li onClick={() => setText('ʒ')}>
                                                <span>ʒ</span>
                                            </li>
                                            <li onClick={() => setText('m')}>
                                                <span>m</span>
                                            </li>
                                            <li onClick={() => setText('n')}>
                                                <span>n</span>
                                            </li>
                                            <li onClick={() => setText('ŋ')}>
                                                <span>ŋ</span>
                                            </li>
                                            <li onClick={() => setText('h')}>
                                                <span>h</span>
                                            </li>
                                            <li onClick={() => setText('l')}>
                                                <span>l</span>
                                            </li>
                                            <li onClick={() => setText('r')}>
                                                <span>r</span>
                                            </li>
                                            <li onClick={() => setText('w')}>
                                                <span>w</span>
                                            </li>
                                            <li onClick={() => setText('j')}>
                                                <span>j</span>
                                            </li>
                                        </ul>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    )}
                    <div className="form-math">
                        <div className="math-item">
                            <MathJax.Provider>
                                {props.valueParent?.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
                                    return (
                                        <div className="math-item-content" key={index_cauhoi}> 
                                        {
                                            (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><Image src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img_cauhoi_${index_cauhoi}`}></Image></div>
                                            ) : (
                                                <div style={{textAlign: 'justify'}}>{item.split('$').map((item2, index2) => {
                                                    return (item.indexOf('$' + item2 + '$') !== -1 && (item2.includes('{') || item2.includes('\\')) && (!item2.includes('\\underline') && !item2.includes('\\bold') && !item2.includes('\\italic'))) ? (
                                                        <MathJax.Node key={index2} formula={item2} />
                                                    ) : (
                                                        <span dangerouslySetInnerHTML={{ __html: item2 }}></span>
                                                    )
                                                })}</div>
                                            )
                                        }
                                        </div>
                                    )}
                                )}
                            </MathJax.Provider>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default TextEditorWidget;