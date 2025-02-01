import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

@withRouter
@translate()
@inject("store")
@observer
export default class LangLink extends Component
{
    setLang( lang )
    {
        this.props.i18n.changeLanguage( lang );
    }
    render()
    {
        return <div>
            <span className="pointer" onClick={()=>this.setLang('zh-cn')}>中文</span> · <span className="pointer" onClick={()=>this.setLang('en')}>English</span>
        </div>;
    }
}