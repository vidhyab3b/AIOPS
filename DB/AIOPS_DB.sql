-- Adminer 5.3.0 MySQL 5.7.44 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP DATABASE IF EXISTS `aiopsdb`;
CREATE DATABASE `aiopsdb` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `aiopsdb`;

DROP TABLE IF EXISTS `Error_RCA`;
CREATE TABLE `Error_RCA` (
  `id` bigint(20) NOT NULL,
  `errorid` bigint(20) DEFAULT NULL,
  `prompt` varchar(1000) DEFAULT NULL,
  `ai_response` mediumtext,
  `ansible_playbook` mediumtext,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Error_RCA` (`id`, `errorid`, `prompt`, `ai_response`, `ansible_playbook`, `created_at`) VALUES
(1,	2,	' please create an ansible playbook check status and start the services to fix this issue. please provide yaml output only',	'',	'```yaml\n---\n- name: Check and Start Services\n  hosts: all  # Adjust to your target hosts\n  become: true  # Required for service management\n\n  tasks:\n    - name: Check service status\n      service:\n        name: \"{{ item }}\"  # Iterate through the list of services\n        state: started   #  Check if the service is running\n      register: service_status\n      loop:\n        - nginx  # Replace with the actual service name(s)\n        - apache2 # Example, add more services as needed\n\n    - name: Start service if not running\n      service:\n        name: \"{{ item.item }}\"\n        state: started\n      when: item.status.active is not defined or item.status.active == false #Check if the status.active is not defined or the status is false\n      loop: \"{{ service_status.results }}\"\n      notify:\n        - restart service handler\n    - name: Print status of services\n      debug:\n        msg: \"Service {{ item.item }} is running: {{ item.status.active }}\"\n      loop: \"{{ service_status.results }}\"\n\n  handlers:\n    - name: restart service handler\n      service:\n        name: \"{{ item.item }}\"\n        state: restarted\n```\n',	'2025-10-10 00:00:00'),
(2,	2,	' please create an ansible playbook check status and start the services to fix this issue. please provide yaml output only',	'',	'```yaml\n---\n- name: Check and Start Services\n  hosts: all  # Adjust to your target hosts\n  become: true  # Required for service management\n\n  tasks:\n    - name: Check service status\n      service:\n        name: \"{{ item }}\"  # Iterate through the list of services\n        state: started   #  Check if the service is running\n      register: service_status\n      loop:\n        - nginx  # Replace with the actual service name(s)\n        - apache2 # Example, add more services as needed\n\n    - name: Start service if not running\n      service:\n        name: \"{{ item.item }}\"\n        state: started\n      when: item.status.active is not defined or item.status.active == false #Check if the status.active is not defined or the status is false\n      loop: \"{{ service_status.results }}\"\n      notify:\n        - restart service handler\n    - name: Print status of services\n      debug:\n        msg: \"Service {{ item.item }} is running: {{ item.status.active }}\"\n      loop: \"{{ service_status.results }}\"\n\n  handlers:\n    - name: restart service handler\n      service:\n        name: \"{{ item.item }}\"\n        state: restarted\n```\n',	'2025-10-10 00:00:00'),
(3,	1,	' please create an ansible playbook check status and start the services to fix this issue. please provide yaml output only',	'',	'```yaml\n---\n- name: Check and Start Services\n  hosts: all\n  become: true\n  tasks:\n    - name: Check service status\n      service:\n        name: \"{{ item }}\"\n        state: started # Check if service is running (changed to \'started\' from \'running\' to force a start if not running)\n      register: service_status\n      loop:\n        - \"{{ service_name_1 }}\"\n        - \"{{ service_name_2 }}\"\n        - \"{{ service_name_3 }}\"  #Added this to address the previous error.\n\n    - name: Start service if not running\n      service:\n        name: \"{{ item.item }}\"\n        state: started\n      when: not item.status.active # Corrected the \'when\' condition to use status.active\n      loop: \"{{ service_status.results }}\"\n      notify:\n        - Restart Service Handlers\n\n  handlers:\n    - name: Restart Service Handlers\n      service:\n        name: \"{{ item.item }}\"\n        state: restarted\n      loop: \"{{ service_status.results }}\"\n      when: item.changed # Restart only when service state has changed.\n\n  vars:\n    service_name_1: httpd  # Replace with the actual service name\n    service_name_2: mysqld # Replace with the actual service name\n    service_name_3: nginx # Replace with the actual service name\n```\n',	'2025-10-10 00:00:00');

DROP TABLE IF EXISTS `Error_RCA_SEQ`;
CREATE TABLE `Error_RCA_SEQ` (
  `next_val` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Error_RCA_SEQ` (`next_val`, `id`) VALUES
(51,	1);

DROP TABLE IF EXISTS `Error_Table`;
CREATE TABLE `Error_Table` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `Server_Name` varchar(255) DEFAULT NULL,
  `Error_Message` text,
  `Created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Error_Table` (`id`, `Server_Name`, `Error_Message`, `Created_at`, `Status`) VALUES
(1,	'bastion.wkq7q.sandbox2937.opentlc.com',	'Nginx service is not running.',	'2025-10-10 02:56:45',	'Open'),
(2,	'bastion.wkq7q.sandbox2937.opentlc.com',	'Nginx service is not running.',	'2025-10-10 02:57:16',	'Open');

DROP TABLE IF EXISTS `Playbook_Status`;
CREATE TABLE `Playbook_Status` (
  `id` bigint(20) NOT NULL,
  `Error_ID` bigint(20) DEFAULT NULL,
  `RCA_ID` bigint(20) DEFAULT NULL,
  `server_Name` varchar(255) DEFAULT NULL,
  `execution_Status` varchar(100) DEFAULT NULL,
  `Created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- 2025-10-13 02:26:12 UTC