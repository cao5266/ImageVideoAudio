# 项目文档结构说明

## 目录结构

```
.
├── README.md                  # 项目主说明文档
├── CLAUDE.md                  # Claude AI上下文文档（根目录和各模块）
├── doc/                       # 项目文档目录
│   ├── DEPLOYMENT.md          # 部署指南
│   ├── IMPROVEMENT_PLAN.md    # 功能完善计划
│   ├── PROJECT_SUMMARY.md     # 项目概要
│   ├── QUICKSTART.md          # 快速开始指南
│   ├── TESTING.md             # 测试策略和方法
│   ├── 启动说明.md            # 项目启动说明（中文）
│   ├── IMAGE_PROCESS_LAYOUT_OPTIMIZATION.md  # 图片处理页面布局优化方案
│   ├── FFmpeg命令手册.md      # FFmpeg命令参考手册
│   ├── SETUP.md               # 后端设置指南
│   └── DOCUMENTATION_STRUCTURE.md  # 本文档
├── backend/
│   ├── CLAUDE.md              # 后端AI上下文文档
│   └── README.md              # 后端说明文档
└── frontend/
    ├── CLAUDE.md              # 前端AI上下文文档
    └── README.md              # 前端说明文档
```

## 文档分类说明

### 核心文档（项目根目录）
- `README.md` - 项目主说明文档
- `CLAUDE.md` - Claude AI上下文文档

### 技术文档（doc目录）
包含详细的开发、部署、测试等技术文档

### 模块文档（各模块目录下）
- `backend/CLAUDE.md` - 后端AI上下文文档
- `backend/README.md` - 后端说明文档
- `frontend/CLAUDE.md` - 前端AI上下文文档
- `frontend/README.md` - 前端说明文档

## 维护说明

1. 除根目录的`README.md`和`CLAUDE.md`外，所有其他文档都应放在`doc`目录中
2. 新增文档时应根据内容类型放置在相应位置
3. 文档命名应清晰明确，使用英文或中文均可
4. 重要文档应包含版本信息和最后更新时间