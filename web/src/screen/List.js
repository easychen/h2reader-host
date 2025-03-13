import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { ControlGroup, InputGroup, Button, FileInput  } from "@blueprintjs/core";
import BookItem from '../component/BookItem'; 
import UploadButton from '../component/UploadButton'; 



import DocumentTitle from 'react-document-title';

function readTextFile(file, callback) 
{
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

@withRouter
@translate()
@inject("store")
@observer
export default class List extends Component
{
    state = { 
        "books":[],
        "bookurl":"",
        "selectedFile": null
    }

    handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.h2book')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const jsonData = JSON.parse(content);
                if (jsonData) {
                    this.props.history.push('/read/local', { bookData: jsonData });
                }
            };
            reader.readAsText(file);
        } else {
            window.alert('请选择.h2book文件');
        }
    }

    doJump()
    {
        this.props.history.push('/read/'+encodeURIComponent(encodeURIComponent( this.state.bookurl )));
        //console.log( this.props );
    }
    
    componentDidMount()
    {
        readTextFile( 'books/index.json' , ( data )=>
        {
            if( data )
                this.setState( { ...JSON.parse( data ) } )
        } );
        
    }

    render()
    {
        const books = this.state.books;
        let count = 1;
        
        const main = <div className="list-page">
        <div className="jumpbox">
            <div className="row">
                <div className="left">
                    <ControlGroup fill={true} vertical={false}>

                    <InputGroup 
                        placeholder="输入.h2book文件的url..." 
                        value={this.state.bookurl} 
                        onChange={ ( evt )=>{ this.setState( { "bookurl" : evt.target.value } ) }} 
                        large={true} 
                        rightElement={
                            <>
                                <input 
                                    type="file" 
                                    accept=".h2book" 
                                    style={{ display: 'none' }} 
                                    onChange={this.handleFileSelect} 
                                    id="file-input"
                                />
                                <Button 
                                    icon="document" 
                                    minimal={true} 
                                    onClick={() => document.getElementById('file-input').click()}
                                />
                            </>
                        }
                    />

                    <Button icon="arrow-right" onClick={()=>{this.doJump()}} large={true} />

                    </ControlGroup>
                </div>
                { this.state.upload_url &&  <div className="right">
                    <UploadButton upload_url={this.state.upload_url} site_url={this.state.site_url} />
                    
                </div> }
            </div>
        

        
        </div>

        <div className="logoline">
            <img src="/image/h2.logo.png" alt="logo"/>
            {/* <div className="subtitle">列表</div> */}
        </div>
        <ul className="booklist">
        { books.length > 0 && books.map((item)=>{
            // console.log( item );
            return <BookItem key={count++} data={item} /> 
        }) }
        </ul>
        
    </div>;
        return <DocumentTitle title={this.props.store.appname}>{main}</DocumentTitle>;
    }
}