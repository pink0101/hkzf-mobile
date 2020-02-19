import React from 'react';
import ReactDOM from 'react-dom';

// 导入 antd-mobile 的样式
import 'antd-mobile/dist/antd-mobile.css'
// 注意： 自己写全局样式要放在组件库样式后导入 
import './index.css';

// 导入字体图标库
import './assets/fonts/iconfont.css'

// 导入 react-virtualized 的样式
import 'react-virtualized/styles.css'

// 注意：应该将 组件 的导入放在样式导入后面，从而避免样式覆盖的问题
import App from './App';


ReactDOM.render(<App/>, document.getElementById('root'));

