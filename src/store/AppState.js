import { observable, action } from "mobx";
import axios from 'axios';

class AppState
{
    @observable appname = "方糖氢小说·阅读器";    
}

export default new AppState();