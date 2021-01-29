const appPages: Array<menuItem> = [
    {
        title: '主页',
        url: '/home',
        type: 'link',
        icon: 'home',
        active: false,
        notModify: true,
    },
    {
        title: '订单跟踪',
        url: '/order-track',
        type: 'link',
        icon: 'analytics',
        active: false,
        limit: 'order-track-main',
        children: [
            {
                title: '订单跟踪',
                url: '/order-track',
                type: 'link',
                limit: 'order-track',
                icon: 'analytics',
                sonIndex: 0,
            },
            {
                title: '历史订单',
                url: '/history-order',
                type: 'link',
                limit: 'history-order',
                icon: 'code-working',
                sonIndex: 1,
            },
            {
                title: '获取合同接口',
                url: '/get-contract',
                limit: 'get-contract',
                type: 'link',
                icon: 'git-merge',
                sonIndex: 2,
            },
        ],
    },
    {
        title: '验货申请列表',
        url: '/apply-inspection',
        type: 'link',
        icon: 'paper',
        limit: 'inspection-application-main',
        active: false,
        children: [
            {
                title: '申请列表',
                url: '/apply-inspection',
                limit: 'apply-inspection',
                type: 'link',
                icon: 'paper',
                sonIndex: 0,
            },
            {
                title: '验货列表',
                url: '/inspection-list',
                type: 'link',
                limit: 'inspection-list',
                icon: 'done-all',
                sonIndex: 1,
            },
        ],
    },
    {
        title: '验货分配',
        url: '/order-grouping',
        type: 'link',
        icon: 'calendar',
        limit: 'inspection-distribution',
        active: false,
        children: [
            {
                title: '创建验货批次',
                url: '/order-grouping',
                type: 'link',
                limit: 'create-inspection-group',
                icon: 'options',
                sonIndex: 0,
            },
            {
                title: '已创建批次列表',
                url: '/distributed-group-list',
                type: 'link',
                limit: 'distributed-group-list',
                icon: 'checkbox-outline',
                sonIndex: 1,
            },
            {
                title: '分配验货',
                url: '/distribute-inspection',
                limit: 'distribute-inspect',
                type: 'link',
                icon: 'calendar',
                sonIndex: 2,
            },
            {
                title: '待审核任务',
                url: '/select-distributed-list',
                limit: 'select-distributed-list',
                type: 'link',
                icon: 'apps',
                sonIndex: 3,
            },
            {
                title: '已确认任务列表',
                url: '/confirmed-task-list',
                limit: 'confirmed-task-list',
                type: 'link',
                icon: 'repeat',
                sonIndex: 4,
            },
        ],
    },
    {
        title: '验货审核',
        url: '/data-compare',
        type: 'link',
        icon: 'git-compare',
        limit: 'inspection-check',
        active: false,
        children: [
            {
                title: '数据对比',
                url: '/data-compare',
                limit: 'inspection-compare',
                type: 'link',
                icon: 'git-compare',
                sonIndex: 5,
            },
        ],
    },
    {
        title: '排柜',
        url: '/arraying-container',
        type: 'link',
        icon: 'phone-landscape',
        limit: 'container-arrangement',
        active: false,
        children: [
            {
                title: '待排柜',
                url: '/stay-arraying-list',
                limit: 'container-arrangement-waiting',
                type: 'link',
                icon: 'phone-landscape',
                sonIndex: 0,
            },
            {
                title: '已排柜',
                url: '/arraying-container',
                limit: 'container-arranged',
                type: 'link',
                icon: 'flag',
                sonIndex: 1,
            },
            {
                title: '待装柜',
                url: '/installed-cabinets',
                limit: 'container-loading',
                type: 'link',
                icon: 'cube',
                sonIndex: 2,
            },
            {
                title: '最终列表',
                url: '/final-cabinets',
                limit: 'final-list-main',
                type: 'link',
                icon: 'checkmark',
                sonIndex: 3,
            },
        ],
    },
    // -----------------------
    {
        title: '工厂考察',
        url: '/factory-inspect',
        type: 'link',
        icon: 'search',
        // limit: 'container-arrangement', //TODO 放排柜
        limit: 'inspect-factory',
        active: false,
        children: [
            {
                title: '工厂列表',
                url: '/factory-inspect',
                // limit: 'container-arrangement',
                limit: 'inspect-factory',
                type: 'link',
                icon: 'list',
                sonIndex: 0,
            },
        ],
    },
    {
        title: '报销管理',
        url: '/reimbursement-management',
        type: 'link',
        icon: 'logo-yen',
        limit: 'container-arrangement', //权限
        active: false,
        children: [
            {
                title: '报销管理',
                url: '/reimbursement-management',
                limit: 'container-arrangement', //权限
                type: 'link',
                icon: 'logo-yen',
                sonIndex: 0,
            },
        ],
    },
    // {
    //     title: '监装',
    //     url: '/inspection-storage',
    //     type: 'link',
    //     icon: 'search',
    //     limit: 'container-arrangement', //监装的权限
    //     children: [
    //         {
    //             title: '任务分配',
    //             url: '/inspection-storage',
    //             limit: 'container-arrangement', //监装的权限
    //             type: 'link',
    //             icon: 'list',
    //             sonIndex: 0,
    //         },
    //         {
    //             title: '已分配列表',
    //             url: '/prepared-list',
    //             limit: 'container-arrangement', //监装的权限
    //             type: 'link',
    //             icon: 'list',
    //             sonIndex: 1,
    //         },
    //         {
    //             title: '已监装列表',
    //             url: '/inspection-storage-list',
    //             limit: 'container-arrangement', //监装的权限
    //             type: 'link',
    //             icon: 'list',
    //             sonIndex: 2,
    //         },
    //     ],
    // },
    {
        title: '用户管理',
        url: '/develope-list',
        type: 'link',
        limit: 'user-management',
        icon: 'contacts',
        active: false,
        notModify: true,
        children: [
            {
                title: '用户列表',
                url: '/user-list',
                limit: 'user-list-main',
                type: 'link',
                icon: 'person',
                sonIndex: 0,
            },
            {
                title: '修改密码',
                url: '/modify-pwd',
                limit: 'password-change',
                type: 'link',
                icon: 'key',
                sonIndex: 1,
            },
        ],
    },
    {
        title: '权限',
        url: '/permission',
        limit: 'permission',
        type: 'link',
        icon: 'hammer',
        active: false,
        notModify: false,
        children: [
            {
                title: '权限列表',
                url: '/permission',
                limit: 'permissions-list',
                type: 'link',
                icon: 'hammer',
                active: false,
                sonIndex: 0,
            },
            // {
            //     title: '角色管理',
            //     url: '/role',
            //     limit: 'role',
            //     type: 'link',
            //     icon: 'disc',
            //     active: false,
            //     sonIndex: 1,
            // },
            {
                title: '用户组',
                url: '/user-group',
                limit: 'user-group',
                type: 'link',
                icon: 'person',
                sonIndex: 1,
            },
            {
                title: '部门列表',
                url: '/develope-list',
                limit: 'department-list-main',
                type: 'link',
                icon: 'logo-codepen',
                sonIndex: 2,
            },
        ],
    },
    {
        title: '退出',
        type: 'btn',
        icon: 'exit',
        active: false,
    },
];

export interface menuItem {
    title?: string;
    url?: string;
    type?: string;
    icon?: string;
    active?: boolean;
    limit?: string;
    children?: menuItem[];
    sonIndex?: number; //手动设置active的时候用到的children的子索引
    notModify?: boolean; //TODO 临时字段  区分改版和未改版
}

export var menu: Array<menuItem> = appPages;
