-- Create syntax for TABLE 'scurd_admin'
CREATE TABLE `scurd_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  `name` varchar(64) NOT NULL COMMENT '管理员用户名',
  `nickname` varchar(64) NOT NULL COMMENT '管理员昵称',
  `password` char(60) NOT NULL COMMENT '密码',
  `role` enum('super','editor','viewer') NOT NULL COMMENT '权限（super 超级管理员、editor 编辑、viewer 查看）',
  `note` varchar(64) DEFAULT NULL COMMENT '备注',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='管理员表';

-- Create syntax for TABLE 'scurd_project'
CREATE TABLE `scurd_project` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '项目ID',
  `name` varchar(64) NOT NULL COMMENT '项目名称',
  `note` varchar(64) DEFAULT NULL COMMENT '项目备注',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='项目';

-- Create syntax for TABLE 'scurd_project_role'
CREATE TABLE `scurd_project_role` (
  `project_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  PRIMARY KEY (`project_id`,`admin_id`),
  KEY `fk_project_role_scurd_project1_idx` (`project_id`),
  KEY `fk_project_role_scurd_admin1_idx` (`admin_id`),
  CONSTRAINT `fk_project_role_scurd_admin1` FOREIGN KEY (`admin_id`) REFERENCES `scurd_admin` (`id`),
  CONSTRAINT `fk_project_role_scurd_project1` FOREIGN KEY (`project_id`) REFERENCES `scurd_project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='权限表';

-- Create syntax for TABLE 'scurd_table'
CREATE TABLE `scurd_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '数据表ID',
  `name` varchar(64) NOT NULL COMMENT '表名',
  `project_id` int(11) NOT NULL COMMENT '项目ID',
  `database_id` int(11) DEFAULT NULL COMMENT '数据库',
  `is_offline` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否下线',
  `is_update` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可以更新',
  `note` varchar(64) DEFAULT NULL COMMENT '备注',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_scurd_table_scurd_project_idx` (`project_id`),
  CONSTRAINT `fk_scurd_table_scurd_project` FOREIGN KEY (`project_id`) REFERENCES `scurd_project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='数据表';