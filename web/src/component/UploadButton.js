import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

import { Button, Overlay, ControlGroup, InputGroup, AnchorButton, Dialog, FormGroup  } from "@blueprintjs/core";
import Dropzone from 'react-dropzone';
import axios from 'axios';
import QRImage from '../component/QRImage';
import {CopyToClipboard} from 'react-copy-to-clipboard';

@withRouter
@translate()
@inject("store")
@observer
export default class UploadButton extends Component
{
    constructor(props) 
    {
        super(props);
        this.drop_ref = React.createRef();
        this.state = { 
            url: false,
            showKeyDialog: false,
            uploadKey: '',
            selectedFile: null
        };
    }
    
    // componentDidMount()
    // {
    //    // 
    // }
    async onDropped( acceptedFiles )
    {
        this.setState({
            selectedFile: acceptedFiles[0],
            showKeyDialog: true
        });
    }

    async handleUpload() {
        try {
            const formData = new FormData();
            formData.append("book", this.state.selectedFile);
            formData.append("upload_key", this.state.uploadKey);

            let uploadUrl = this.props.upload_url;
            
            if(uploadUrl.startsWith('/')) {
                const protocol = window.location.protocol;
                const host = window.location.host;
                uploadUrl = `${protocol}//${host}${uploadUrl}`;
            }

            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(response.data.code === 0) {
                this.setState({
                    url: response.data.data.url,
                    showKeyDialog: false,
                    uploadKey: '',
                    selectedFile: null
                });
            } else {
                alert('上传失败: ' + response.data.message);
            }
        } catch (error) {
            console.error('Upload error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert('上传失败: ' + error.response.data.message);
            } else {
                alert('上传失败,请检查服务器连接');
            }
        }
    }

    onClose()
    {
        if( !window.confirm("关闭后将无法找到这个地址，请确定保存后再关闭。是否继续？") ) return false;

        this.setState({url:false});
    }

    

    render()
    {
        // 获取当前站点URL作为基础URL
        const baseUrl = window.location.origin;
        
        // 如果 site_url 为空,就使用当前站点URL
        const siteUrl = this.props.site_url || baseUrl;
        
        // 构建完整的阅读URL
        const read_url = this.state.url ? `${siteUrl}/read/${encodeURIComponent(this.state.url)}` : '';

        return <><Dropzone 
        accept=".h2book"  
        maxSize={1024*1024*10}
        multiple={false} 
        ref={this.drop_ref} 
        onDrop={acceptedFiles => this.onDropped(acceptedFiles)}>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
              {/*  */}
              <input {...getInputProps()} />
              <Button icon="upload" large={true} />
          </div>
          

        )}
            </Dropzone>

            <Dialog
                isOpen={this.state.showKeyDialog}
                onClose={() => this.setState({ showKeyDialog: false })}
                title="请输入上传密钥"
            >
                <div className="bp3-dialog-body">
                    <FormGroup label="上传密钥">
                        <InputGroup
                            value={this.state.uploadKey}
                            onChange={(e) => this.setState({ uploadKey: e.target.value })}
                            placeholder="请输入上传密钥"
                        />
                    </FormGroup>
                </div>
                <div className="bp3-dialog-footer">
                    <div className="bp3-dialog-footer-actions">
                        <Button onClick={() => this.setState({ showKeyDialog: false })} text="取消" />
                        <Button intent="primary" onClick={() => this.handleUpload()} text="上传" />
                    </div>
                </div>
            </Dialog>

            <Overlay isOpen={this.state.url } >
            <div className="overbox">
                <div className="centerbox">
                    <QRImage value={read_url} />
                    <div>

                    <div className="explain">微信扫码即可阅读，可保存图片分享到朋友圈</div>

                    <div className="therow">
                    <Button text="关闭" icon="cross" onClick={()=>this. onClose()} large={true} />

                    <AnchorButton href={read_url} icon="manual"  text="开始阅读" large={true} intent="PRIMARY" />
                   
                    </div>

                    <div className="std-hr"></div>

                    <ControlGroup fill={true} vertical={false}>
                    <InputGroup value={read_url} readOnly={true} large={true} />

                    
                    
                    <CopyToClipboard text={read_url} onCopy={()=>alert("已复制到剪贴板")}>
                        <Button text="复制阅读地址" large={true} />
                    </CopyToClipboard>

                    </ControlGroup>

                    

                    
                    
                    </div>
                    
                </div>
            </div>
            
            </Overlay>
        </>
    }
}