import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
import DocumentTitle from 'react-document-title';
import TalkList from '../component/TalkList';

@withRouter
@translate()
@inject("store")
@observer
export default class Reader extends Component
{
    // constructor(props) 
    // {
    //     super(props);
    // }
    state = { "meta":{} , "talks":[] , "roles":[] , "show_talks":[] }
    
    componentDidMount()
    {
        let bookid = 1;
        let bookpath = `/books/${bookid}.h2book`;

        const param = this.props.match.params.id;
        if( isNaN( param ) )
        {
            // 字符串
            bookpath = decodeURIComponent( param );
        }
        else
        {
           // 数字
           if( parseInt(param) > 0 ) bookid = parseInt(param);
           else bookid = 1;

           bookpath = `/books/${bookid}.h2book`;
        }
        
        
        
        

        try
        {
            JSZipUtils.getBinaryContent( bookpath , async ( err, data ) => 
            {
                if(err) 
                {
                    window.alert("文件载入失败，请返回确认地址是否正确。");
                    console.log( err );
                    // throw err; // or handle err
                }
                else
                {
                    //console.log("FILE OK");

                    const zip = await JSZip.loadAsync( data );
                    const data2 = await zip.file("h2content.json").async("string");
                    const jsondata = JSON.parse( data2 );

                    if( jsondata )
                    {
                        this.setState( {...jsondata} );
                    }                
                }
            });
        }catch( e )
        {
            alert("文件载入失败，请返回确认地址是否正确。");
            console.log( err );
        }
        

        
        
        
 
    }

    render()
    {
        const state = this.state;

        const main = <div className="read-page">{state.talks && state.talks.length > 0 && <TalkList talks={state.talks} roles={state.roles} meta={state.meta}  />}
        </div>;

        const title = state.meta.name ? state.meta.name + '@' + this.props.store.appname : this.props.store.appname;

        return <DocumentTitle title={title}>{main}</DocumentTitle>;
    }
}