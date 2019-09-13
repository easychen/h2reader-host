import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

import { Button, Overlay, ControlGroup, InputGroup, AnchorButton  } from "@blueprintjs/core";
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
        this.state = { "url" : false };
    }
    
    // componentDidMount()
    // {
    //    // 
    // }
    async onDropped( files )
    {
        if( !this.props.upload_url )
        {
            alert("错误的上传地址");
            return false;
        }

        const formData = new FormData();
        formData.append("book", files[0]);

        // const store = this.props.store;
        // store.openFile( files[0] );
        const { data } = await axios.post( this.props.upload_url , formData);

        if( data.code > 0 )
        {
            alert( data.message );
        }
        else
        {
            if( data.data && data.data.url )
            {
                // show qrcode
                this.setState( {"url":data.data.url} );
            }
        }  
    }

    onClose()
    {
        if( !window.confirm("关闭后将无法找到这个地址，请确定保存后再关闭。是否继续？") ) return false;

        this.setState({"url":false});
    }

    

    render()
    {
        const read_url = this.props.site_url + '/read/'+ encodeURIComponent(encodeURIComponent(this.state.url));

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