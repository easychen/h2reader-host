import { observable, action } from "mobx";
import axios from 'axios';

class AppState
{
    @observable appname = "方糖小剧场";    
}

export default new AppState();