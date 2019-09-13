import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import TalkItem from '../component/TalkItem'; 
import { Icon, AnchorButton  } from "@blueprintjs/core";

@withRouter
@translate()
@inject("store")
@observer
export default class TalkList extends Component
{
    constructor(props) 
    {
        super(props);
        this.state = {
            "talks":[],
            "show_talks":[],
            "end":false
        };
        this.end_ref = React.createRef();
    }

    componentDidMount()
    {
       this.loadData();
    }

    loadData()
    {
        this.alltalks = this.props.talks;
        this.setState( { "talks": this.props.talks , "end" : this.props.talks.length < 1 } );
    }

    componentDidUpdate(prevProps)
    {
        if (this.props.current_talk_id !== prevProps.current_talk_id) 
        {
            this.loadData();
            this.showToId( this.props.current_talk_id );
            this.toBottom();
            // console.log( "now id" , this.props.current_talk_id );
        }
    }

    showToId = ( id ) =>
    {
        let to_index = -1;
        this.alltalks.forEach( ( item , index ) => 
        {
            if( item.id == id ) to_index = index;
            // else console.log( "item.id != id", item.id , id );

        } );

        console.log( "to_index",to_index );
        if( to_index >= 0 )
        {
            this.setState({
                "show_talks":this.alltalks.slice(0,to_index+1),
                "talks":this.alltalks.slice(to_index+1)
            })

            setTimeout(() => {
                this.toBottom();
            }, 100);
        }
    }



    showOne = ()=>
    {
        const state = this.state;
        if( state.talks.length < 1 )
        {
            this.setState( { "end": true} );
            return false;
        } 

        let talks1 = state.talks;
        let thetalk = talks1.shift();
        let show_talks1 = state.show_talks;
        show_talks1.push(thetalk);

        this.setState( { "talks":talks1 , "show_talks":show_talks1 } );

        setTimeout(() => {
            this.toBottom();
        }, 100);
        

        return thetalk;
 
    }

    toBottom = () =>
    {
        if( this.end_ref && this.end_ref.current )
            this.end_ref.current.scrollIntoView( true );
    }

    

    render()
    {
        const state = this.state;
        const props = this.props;
        
        
        return  state.talks  ?
        <div className="talklist-ro" >
            <div className="thelist">
            { state.show_talks.length > 0 
            ? 
            <>
            {state.show_talks.map( item => <TalkItem roles={props.roles} key={item.id} data={item} /> ) }
            </>
            : 
            
            <div className="guide">
                <div className="logo"> <img src="/image/h2.logo.png" /> </div>
                <div className="back">
                    <Link to="/"><Icon iconSize={40} icon="circle-arrow-left" /></Link>
                </div>
                { this.props.meta && <><div className="name">{this.props.meta.name}</div>
                <div className="author"><Icon icon="user" /> {this.props.meta.author}</div>
                <div className="link"><Icon icon="link" /> {this.props.meta.link}</div>
                <div className="detail">{this.props.meta.detail}</div></>  }
                <div className="continue">点击下方的 ✦ 开始</div>
                

            </div> 
            }

            <div ref={this.end_ref} style={{"marginTop":"100px"}}></div>
            

            </div>
            <div className="touchpad" onClick={()=>this.showOne()}>
                {state.end ? <Link className="thelink" to="/"><span className="blink noselect" > done </span></Link> : <span className="blink noselect" > ✦ </span>}
            </div>
            
        </div> : null ;
    }
}