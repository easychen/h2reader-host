import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
import DocumentTitle from 'react-document-title';
import TalkList from '../component/TalkList';

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

const sortTalks = (talks) => {
  return [...talks].sort((a, b) => {
    // 首先按 chapter_id 排序
    if (a.chapter_id !== b.chapter_id) {
      return a.chapter_id - b.chapter_id;
    }
    // chapter_id 相同时，按 order 排序
    return a.order - b.order;
  });
};

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
        // 检查是否有本地文件数据
        if (this.props.location.state && this.props.location.state.bookData) {
            const jsondata = this.props.location.state.bookData;
            const sortedTalks = sortTalks(jsondata.talks);
            jsondata.talks = sortedTalks;
            this.setState({ ...jsondata });
            return;
        }

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
            // JSZipUtils.getBinaryContent( bookpath , async ( err, data ) => 
            // {
            //     if(err) 
            //     {
            //         window.alert("文件载入失败，请返回确认地址是否正确。");
            //         console.log( err );
            //         this.props.history.replace("/");
            //         // throw err; // or handle err
            //     }
            //     else
            //     {
            //         //console.log("FILE OK");

            //         const zip = await JSZip.loadAsync( data );
            //         const data2 = await zip.file("h2content.json").async("string");
            //         const jsondata = JSON.parse( data2 );

            //         if( jsondata )
            //         {
            //             this.setState( {...jsondata} );
            //         }                
            //     }
            // });
            readTextFile( bookpath , ( data ) =>
            {
                const jsondata = JSON.parse( data );

                if( jsondata )
                {
                    const sortedTalks = sortTalks(jsondata.talks);
                    jsondata.talks = sortedTalks;
                    this.setState( {...jsondata} );
                }   
            });

        }catch( e )
        {
            alert("文件载入失败，请返回确认地址是否正确。");
            console.log( e );
            this.props.history.replace("/");
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