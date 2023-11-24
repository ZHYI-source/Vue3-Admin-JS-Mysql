/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50736
 Source Host           : localhost:3306
 Source Schema         : mealpass

 Target Server Type    : MySQL
 Target Server Version : 50736
 File Encoding         : 65001

 Date: 23/11/2023 23:46:10
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions`  (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '权限名称',
  `key` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '权限键',
  `parent_key` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '父级权限键（可选）',
  `auth` tinyint(1) NULL DEFAULT 0 COMMENT '是否是权限按钮',
  `status` int(10) NOT NULL DEFAULT 1 COMMENT '状态',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES ('0782054e-30b6-41ee-a2f8-25c5a426b3b8', '查询', 'sys:role:list', 'sys:role', 1, 1, '2023-11-18 10:24:28', '2023-11-18 15:34:41');
INSERT INTO `permissions` VALUES ('0db296c8-8e53-434e-be6b-e62ea9a24c8c', '角色管理', 'sys:role', 'sys', 0, 1, '2023-11-18 10:24:28', '2023-11-18 10:24:28');
INSERT INTO `permissions` VALUES ('0eb8799e-adb2-480c-a136-ba7664ca75d6', '超级管理权限', '*', '', 0, 1, '2023-11-18 06:06:35', '2023-11-18 15:42:43');
INSERT INTO `permissions` VALUES ('173ddbfc-08e7-4042-9796-d6a03ca58b2f', '用户管理', 'sys:user', 'sys', 0, 1, '2023-11-18 10:16:18', '2023-11-18 10:16:18');
INSERT INTO `permissions` VALUES ('2bdd2a5b-90cf-4a26-8b3a-732358e00653', '权限管理', 'sys:permissions', 'sys', 0, 1, '2023-11-18 10:15:38', '2023-11-18 10:15:38');
INSERT INTO `permissions` VALUES ('3ab88114-f6e7-4df0-bb8f-08b6ce7a732f', '更新', 'sys:permissions:update', 'sys:permissions', 1, 1, '2023-11-18 10:15:38', '2023-11-18 10:15:38');
INSERT INTO `permissions` VALUES ('4004e9c8-1264-40d2-99ab-9a2fdae7b45f', '查询', 'sys:user:list', 'sys:user', 1, 1, '2023-11-18 10:16:18', '2023-11-18 10:16:18');
INSERT INTO `permissions` VALUES ('40d91521-0365-4903-bdd8-b0a6232fe446', '更新', 'sys:user:update', 'sys:user', 1, 1, '2023-11-18 10:16:18', '2023-11-18 10:16:18');
INSERT INTO `permissions` VALUES ('45253de9-bba3-4302-bacc-b4e9b9845cb2', '删除', 'sys:user:delete', 'sys:user', 1, 1, '2023-11-18 10:16:18', '2023-11-18 10:16:18');
INSERT INTO `permissions` VALUES ('47bf914e-2d4a-4746-8922-f6864488c7f0', '更新', 'sys:role:update', 'sys:role', 1, 1, '2023-11-18 10:24:28', '2023-11-18 10:24:28');
INSERT INTO `permissions` VALUES ('51fa4d99-a136-4f57-8929-0c04f466ecb8', '增加', 'sys:permissions:create', 'sys:permissions', 1, 1, '2023-11-18 10:15:38', '2023-11-18 10:15:38');
INSERT INTO `permissions` VALUES ('5b4f5224-1414-4966-b84d-5fae06ad339f', '查询', 'sys:permissions:list', 'sys:permissions', 1, 1, '2023-11-18 10:15:38', '2023-11-18 10:15:38');
INSERT INTO `permissions` VALUES ('5c4cc5ae-cf7f-4519-bca8-415d04e7d2b2', '删除', 'sys:permissions:delete', 'sys:permissions', 1, 1, '2023-11-18 10:15:38', '2023-11-18 10:15:38');
INSERT INTO `permissions` VALUES ('8f3815eb-a86e-4a98-b04d-20e9d23b962f', '删除', 'sys:role:delete', 'sys:role', 1, 1, '2023-11-18 10:24:28', '2023-11-18 10:24:28');
INSERT INTO `permissions` VALUES ('bca3ed04-a8ce-4003-97e1-cb3a108a6673', '系统管理', 'sys', NULL, 0, 1, '2023-11-18 10:14:41', '2023-11-18 15:42:47');
INSERT INTO `permissions` VALUES ('cec36724-bd3d-46f5-8d47-26706c348580', '增加', 'sys:user:create', 'sys:user', 1, 1, '2023-11-18 10:16:18', '2023-11-18 10:16:18');
INSERT INTO `permissions` VALUES ('f2fc4b5d-f33c-446f-93bd-e5b6af947230', '增加', 'sys:role:create', 'sys:role', 1, 1, '2023-11-18 10:24:28', '2023-11-18 10:24:28');

-- ----------------------------
-- Table structure for resources
-- ----------------------------
DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources`  (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'ID',
  `srcName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资源名称',
  `srcType` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资源类型',
  `previewPath` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '资源预览路径',
  `downloadPath` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '资源预览路径',
  `deletePath` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '资源删除路径',
  `userId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '用户ID',
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '状态',
  `srcSize` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '资源大小',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of resources
-- ----------------------------
INSERT INTO `resources` VALUES ('b82c5b16-d634-4ba9-aca4-d411b42ef65c', '1700709536792.jpg', 'image/jpeg', 'http://localhost:3000/v1/common/files/preview/img/1700709536792.jpg', 'http://localhost:3000/v1/common/files/download/img/1700709536792.jpg', NULL, 'f35f39c3-95c5-4496-80fb-7877bf715aa7', 1, '121.04 KB', NULL, '2023-11-23 03:18:56', '2023-11-23 03:18:56');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'ID',
  `roleName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色名称',
  `roleAuth` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色标识',
  `status` int(10) NOT NULL DEFAULT 1 COMMENT '状态',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('47914c7b-0fa5-485c-bc44-b5d571e1e89e', '超级管理员', 'SUPER', 1, '2023-11-17 08:13:30', '2023-11-18 15:53:27', NULL);
INSERT INTO `role` VALUES ('f222bed7-fcc6-4d42-b6ad-885caf4232fc', '访客', 'VISITOR-ADMIN', 1, '2023-11-18 15:54:04', '2023-11-23 15:44:43', '访客权限');

-- ----------------------------
-- Table structure for role_permissions
-- ----------------------------
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions`  (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'ID',
  `roleId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '角色ID',
  `permissionsId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '权限ID',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role_permissions
-- ----------------------------
INSERT INTO `role_permissions` VALUES ('0d4737fe-0882-488b-9d3f-81b18791dc24', '47914c7b-0fa5-485c-bc44-b5d571e1e89e', '0eb8799e-adb2-480c-a136-ba7664ca75d6', '2023-11-18 06:26:11', '2023-11-18 06:26:11');
INSERT INTO `role_permissions` VALUES ('57f21c87-85ec-4639-aea7-6bc4e6cbdc34', 'f222bed7-fcc6-4d42-b6ad-885caf4232fc', '4004e9c8-1264-40d2-99ab-9a2fdae7b45f', '2023-11-23 03:18:43', '2023-11-23 03:18:43');
INSERT INTO `role_permissions` VALUES ('8c4e5577-9510-425e-94f4-37d5de7d06b6', 'f222bed7-fcc6-4d42-b6ad-885caf4232fc', '5b4f5224-1414-4966-b84d-5fae06ad339f', '2023-11-23 03:18:43', '2023-11-23 03:18:43');
INSERT INTO `role_permissions` VALUES ('a2cc2faa-8cd4-439d-9909-25fe7a779bf5', 'f222bed7-fcc6-4d42-b6ad-885caf4232fc', '0782054e-30b6-41ee-a2f8-25c5a426b3b8', '2023-11-20 10:54:41', '2023-11-20 10:54:41');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'ID',
  `roleId` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色ID',
  `avatar` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '用户头像',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'Vchs0bbdk2pr/Ac6DsHruw==' COMMENT '密码',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'John Doe' COMMENT '昵称',
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '状态',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('61ec01da-fd50-4b5a-a377-de346150b655', 'f222bed7-fcc6-4d42-b6ad-885caf4232fc', 'https://gravatar.kuibu.net/avatar/5c04c6164bbf04f3e6bcbd01dfd00e03?s=100', 'test', 'Vchs0bbdk2pr/Ac6DsHruw==', NULL, '书中枫叶', '1', '2023-11-23 03:21:23', '2023-11-23 03:26:16', NULL);
INSERT INTO `user` VALUES ('f35f39c3-95c5-4496-80fb-7877bf715aa7', '47914c7b-0fa5-485c-bc44-b5d571e1e89e', 'data:image/jpeg;base64,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', 'admin', 'Vchs0bbdk2pr/Ac6DsHruw==', '1840354092@qq.com', 'John Doe', '1', '2023-11-17 08:01:35', '2023-11-23 15:45:48', '超级管理员');

-- ----------------------------
-- Table structure for user_opt_log
-- ----------------------------
DROP TABLE IF EXISTS `user_opt_log`;
CREATE TABLE `user_opt_log`  (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `operator` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作人',
  `operatorId` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作人ID',
  `module` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作模块',
  `platform` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作平台',
  `operatorIP` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备IP',
  `latitude` double NULL DEFAULT NULL COMMENT '纬度',
  `longitude` double NULL DEFAULT NULL COMMENT '经度',
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备位置',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作内容',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_opt_log
-- ----------------------------
INSERT INTO `user_opt_log` VALUES ('034048c0-3316-4a56-a912-d705000b2816', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:14:06', '2023-11-18 07:14:06');
INSERT INTO `user_opt_log` VALUES ('059f2407-9904-4142-9340-8230fed629b5', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:23:32', '2023-11-18 07:23:32');
INSERT INTO `user_opt_log` VALUES ('0c429516-7c77-4af8-a6c3-20f49abd7726', 'John Doe', 'f35f39c3-95c5-4496-80fb-7877bf715aa7', NULL, '未知', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/permissions', '2023-11-18 05:35:35', '2023-11-18 05:35:35');
INSERT INTO `user_opt_log` VALUES ('0d46a106-f017-4b18-b786-c5b118c2e7be', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:59:14', '2023-11-23 03:59:14');
INSERT INTO `user_opt_log` VALUES ('0ea259f3-2a84-4aa2-8f1e-d915fb228c75', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:55:36', '2023-11-23 03:55:36');
INSERT INTO `user_opt_log` VALUES ('19320d37-ec0c-442a-a684-65173f87c9f6', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:24:57', '2023-11-18 07:24:57');
INSERT INTO `user_opt_log` VALUES ('1edc503c-a00d-444c-8e18-fd331d593361', '未知', '-', '用户查询', '未知', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/user', '2023-11-17 06:55:29', '2023-11-17 06:55:29');
INSERT INTO `user_opt_log` VALUES ('1f6c7542-c700-4ebc-b0ec-7d97bcbef326', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:54:52', '2023-11-23 03:54:52');
INSERT INTO `user_opt_log` VALUES ('2219c050-76a5-431b-865c-1e9ae08743d2', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:25:14', '2023-11-18 07:25:14');
INSERT INTO `user_opt_log` VALUES ('344b7ce9-fe9f-4a2d-8a1f-c94bb676718f', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-20 10:54:04', '2023-11-20 10:54:04');
INSERT INTO `user_opt_log` VALUES ('3977341e-d672-4892-b18d-4b7b44621540', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:55:32', '2023-11-23 03:55:32');
INSERT INTO `user_opt_log` VALUES ('3dd539ff-bd03-4104-8479-ed29c04bd294', '未知', '-', '用户查询', '未知', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/user', '2023-11-17 08:01:30', '2023-11-17 08:01:30');
INSERT INTO `user_opt_log` VALUES ('3e65b8c9-fa21-4010-8192-5a3d27f097a4', '未知', '-', '用户查询', '未知', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/user', '2023-11-17 08:01:45', '2023-11-17 08:01:45');
INSERT INTO `user_opt_log` VALUES ('4691388b-de4e-4b06-ae0c-3b00af299e60', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:21:57', '2023-11-23 03:21:57');
INSERT INTO `user_opt_log` VALUES ('475032c4-3e20-49b7-90c6-502ff79bd5a6', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-21 03:24:23', '2023-11-21 03:24:23');
INSERT INTO `user_opt_log` VALUES ('4a8d9345-9950-4939-b715-229f81de388c', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-20 10:53:55', '2023-11-20 10:53:55');
INSERT INTO `user_opt_log` VALUES ('4c09ef74-8a45-422a-abd8-afe8058c5806', 'John Doe', 'f35f39c3-95c5-4496-80fb-7877bf715aa7', '权限管理', '未知', '0.0.0.0', 0, 0, '保留地址', '获取所有权限管理', '2023-11-18 05:48:56', '2023-11-18 05:48:56');
INSERT INTO `user_opt_log` VALUES ('4cb94b1f-9d9c-4496-b942-808c3c1197c0', '未知', '-', '用户查询', '未知', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/user', '2023-11-17 07:55:44', '2023-11-17 07:55:44');
INSERT INTO `user_opt_log` VALUES ('5207c859-c892-4280-9fc8-942e6e18932d', 'John Doe', 'f35f39c3-95c5-4496-80fb-7877bf715aa7', '权限管理', '未知', '0.0.0.0', 0, 0, '保留地址', '获取所有权限管理', '2023-11-18 05:39:30', '2023-11-18 05:39:30');
INSERT INTO `user_opt_log` VALUES ('57f5a94e-16b0-41e5-a447-46cafd95068e', 'John Doe', 'df29278b-6a85-43fb-b969-0f6b589c5628', '权限管理', '未知', '0.0.0.0', 0, 0, '保留地址', '获取所有权限管理', '2023-11-18 06:07:06', '2023-11-18 06:07:06');
INSERT INTO `user_opt_log` VALUES ('5ac00e95-c227-42a7-8bab-eb02954d39f6', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:22:44', '2023-11-23 03:22:44');
INSERT INTO `user_opt_log` VALUES ('7274987b-79ee-403d-ba48-540601c4f846', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 08:25:57', '2023-11-18 08:25:57');
INSERT INTO `user_opt_log` VALUES ('73409754-f06f-4696-b5b9-c4281077d744', 'admin', '-', '登录', '未知', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 05:34:53', '2023-11-18 05:34:53');
INSERT INTO `user_opt_log` VALUES ('7561e0d5-08e9-46c2-a639-871caf36b64b', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:53:22', '2023-11-23 03:53:22');
INSERT INTO `user_opt_log` VALUES ('829b9228-aacf-40f6-993e-b458df59749b', 'admin', '-', '登录', '未知', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 05:49:21', '2023-11-18 05:49:21');
INSERT INTO `user_opt_log` VALUES ('8602d1ca-3f69-47f3-9bbb-77eda554145f', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:13:54', '2023-11-18 07:13:54');
INSERT INTO `user_opt_log` VALUES ('881362e8-6e1f-48fd-871e-8c400e1887a9', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:17:41', '2023-11-18 07:17:41');
INSERT INTO `user_opt_log` VALUES ('897a5583-cb63-4d02-bb23-53b0573433a3', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:21:48', '2023-11-23 03:21:48');
INSERT INTO `user_opt_log` VALUES ('89ac9f9d-c533-41aa-9751-f9a4d1afad05', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:34:40', '2023-11-18 07:34:40');
INSERT INTO `user_opt_log` VALUES ('8c1cff8c-2274-4f11-9f7f-e4732368b637', '未知', '-', '用户查询', '未知', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/user', '2023-11-17 06:55:40', '2023-11-17 06:55:40');
INSERT INTO `user_opt_log` VALUES ('8f2d9bba-736a-4803-8cba-97e6646e9d27', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:58:08', '2023-11-23 03:58:08');
INSERT INTO `user_opt_log` VALUES ('90197c2a-b84d-4615-97bd-f3b9d119be8f', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-20 10:53:59', '2023-11-20 10:53:59');
INSERT INTO `user_opt_log` VALUES ('96565c4c-857d-4179-8aab-990ee92b85e4', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 04:00:39', '2023-11-23 04:00:39');
INSERT INTO `user_opt_log` VALUES ('9e5a74f6-af28-49f6-93a8-2f59b8811fa7', 'admin', '-', '登录', '未知', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 06:27:16', '2023-11-18 06:27:16');
INSERT INTO `user_opt_log` VALUES ('a165599e-3ab3-4cd2-9eb8-3c4524ac83c3', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 04:04:27', '2023-11-23 04:04:27');
INSERT INTO `user_opt_log` VALUES ('a206ff2a-9013-431d-bc97-be4e9b5a482f', 'John Doe', 'df29278b-6a85-43fb-b969-0f6b589c5628', '权限管理', '未知', '0.0.0.0', 0, 0, '保留地址', '获取所有权限管理', '2023-11-18 05:49:44', '2023-11-18 05:49:44');
INSERT INTO `user_opt_log` VALUES ('ac76950d-97f3-4306-b9aa-6d124671c46c', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 04:02:55', '2023-11-23 04:02:55');
INSERT INTO `user_opt_log` VALUES ('b33c7413-c2f9-498d-8410-c0201978b152', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-23 15:41:34', '2023-11-23 15:41:34');
INSERT INTO `user_opt_log` VALUES ('bc112671-2abc-4bb0-b2e1-629ef90bf145', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:54:11', '2023-11-23 03:54:11');
INSERT INTO `user_opt_log` VALUES ('c3327d7e-3b94-4c20-a471-66cadb5f2fac', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:24:09', '2023-11-23 03:24:09');
INSERT INTO `user_opt_log` VALUES ('d478febc-8d4b-4ddb-b25c-88012d65f960', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:13:37', '2023-11-18 07:13:37');
INSERT INTO `user_opt_log` VALUES ('e21018e2-3fc8-40a4-a454-bfca98b056b2', 'John Doe', 'df29278b-6a85-43fb-b969-0f6b589c5628', '权限管理', '未知', '0.0.0.0', 0, 0, '保留地址', '获取所有权限管理', '2023-11-18 05:58:31', '2023-11-18 05:58:31');
INSERT INTO `user_opt_log` VALUES ('e416327e-47f2-43fa-879a-bcbc1cf80c8f', 'John Doe', 'f35f39c3-95c5-4496-80fb-7877bf715aa7', '权限管理', '未知', '0.0.0.0', 0, 0, '保留地址', '获取所有权限管理', '2023-11-18 05:37:09', '2023-11-18 05:37:09');
INSERT INTO `user_opt_log` VALUES ('e5897bce-aaaf-455f-9b68-fa2da255992d', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:22:19', '2023-11-23 03:22:19');
INSERT INTO `user_opt_log` VALUES ('e6466f2d-7191-45e2-b834-02fdf31e3fc9', 'John Doe', 'f35f39c3-95c5-4496-80fb-7877bf715aa7', '权限管理', '未知', '0.0.0.0', 0, 0, '保留地址', '获取所有权限管理', '2023-11-18 05:48:28', '2023-11-18 05:48:28');
INSERT INTO `user_opt_log` VALUES ('f0840fa2-e3f2-4c4f-9e1d-fdb5601472b0', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:20:07', '2023-11-18 07:20:07');
INSERT INTO `user_opt_log` VALUES ('f192ddfa-d533-4b4f-9147-9d4f4af20be1', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:34:50', '2023-11-18 07:34:50');
INSERT INTO `user_opt_log` VALUES ('f440fd2e-ebdd-4cc0-9a6d-e1a098ba5511', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 04:01:00', '2023-11-23 04:01:00');
INSERT INTO `user_opt_log` VALUES ('f91856eb-2392-408d-ad51-0559cce0becf', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:20:59', '2023-11-18 07:20:59');
INSERT INTO `user_opt_log` VALUES ('fad128f5-1b7e-4cba-8345-bdb12b46d292', 'test', '-', '登录', 'Chrome.v119', '0.0.0.0', NULL, NULL, '保留地址', '/v1/sys/auth/login', '2023-11-23 03:53:15', '2023-11-23 03:53:15');
INSERT INTO `user_opt_log` VALUES ('faf96c1a-7122-4673-be58-acabed6a5a43', 'John Doe', 'f35f39c3-95c5-4496-80fb-7877bf715aa7', '权限管理', '未知', '0.0.0.0', 0, 0, '保留地址', '获取所有权限管理', '2023-11-18 05:49:01', '2023-11-18 05:49:01');
INSERT INTO `user_opt_log` VALUES ('fd8f93f0-e68d-4244-b8b1-e8998b18d5c4', 'admin', '-', '登录', 'Chrome.v119', '0.0.0.0', 0, 0, '保留地址', '/v1/sys/auth/login', '2023-11-18 07:23:27', '2023-11-18 07:23:27');

SET FOREIGN_KEY_CHECKS = 1;
