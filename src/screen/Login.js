import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { withRouter,Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import LangLink from '../component/LangLink'; 
import DocumentTitle from 'react-document-title';

@withRouter
@translate()
@inject("store")
@observer
export default class Login extends Component
{
    render()
    {
        const { t } = this.props;
        const main = <div className="box">
            <div className="title">{t("Welcome")}</div>
            <div className="lang"> <LangLink /></div>
        </div>;
        return <DocumentTitle title={this.props.store.appname}>{main}</DocumentTitle>;
    }
}