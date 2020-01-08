import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// 导入 antd-mobile 的样式
import 'antd-mobile/dist/antd-mobile.css'
// 注意： 自己写全局样式要放在组件库样式后导入 
import './index.css';

// 导入字体图标库
import './assets/fonts/iconfont.css'


ReactDOM.render(<App />, document.getElementById('root'));

