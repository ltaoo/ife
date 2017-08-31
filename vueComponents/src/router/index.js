import Vue from 'vue';
import Router from 'vue-router';

// 内容页面根视图
import App from '@/pages/App';
// 销售
import SalePage from '@/pages/SalePage';
// 全体数据 - 大区分析
import Region from '@/pages/Sale/Region';
// 全体数据 - 团队分析
import Team from '@/pages/Sale/Team';
// 员工数据
import Employee from '@/pages/Sale/Employee';
// 行业数据
import Industry from '@/pages/Sale/Industry';
// 产品数据
import Product from '@/pages/Sale/Product';
// 管理页
import Management from '@/pages/Sale/Management';

import Hello from '@/components/Hello';
// 登录页
import Login from '@/pages/LoginPage';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: App,
            children: [
                {
                    path: 'sale',
                    name: 'sale',
                    component: SalePage,
                    children: [
                        {
                            path: 'region',
                            name: 'Region',
                            component: Region,
                        }, {
                            path: 'team',
                            name: 'Team',
                            component: Team,
                        }, {
                            path: 'employee',
                            name: 'Employee',
                            component: Employee,
                        }, {
                            path: 'industry',
                            name: 'Industry',
                            component: Industry,
                        }, {
                            path: 'product',
                            name: 'Product',
                            component: Product,
                        }, {
                            path: 'management',
                            name: 'Management',
                            component: Management,
                        },
                    ],
                },
            ],
        },
        {
            path: '/test',
            name: 'Hello',
            component: Hello,
        }, {
            path: '/login',
            name: 'Login',
            component: Login,
        },
    ],
});
