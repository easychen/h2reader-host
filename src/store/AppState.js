import { observable, action } from "mobx";
import axios from 'axios';

class AppState
{
    @observable appname = "EasyStarter";    
}

export default new AppState();