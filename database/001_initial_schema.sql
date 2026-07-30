-- Site Lavajato - Schema Inicial
-- Importar este arquivo no phpMyAdmin da Hostinger
-- Data: 2026-07-30

-- ============================================================================
-- USUARIOS E AUTENTICACAO
-- ============================================================================

CREATE TABLE `users` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191),
  `passwordHash` LONGTEXT NOT NULL,
  `role` ENUM('OWNER','MANAGER','ATTENDANT','WASHER','FINANCE') NOT NULL DEFAULT 'OWNER',
  `status` ENUM('ACTIVE','DISABLED','DELETED') NOT NULL DEFAULT 'ACTIVE',
  `isFirstLogin` BOOLEAN NOT NULL DEFAULT TRUE,
  `lastLoginAt` DATETIME,
  `lastLoginIp` VARCHAR(191),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_sessions` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `refreshTokenHash` LONGTEXT NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `revokedAt` DATETIME(3),
  `userAgent` LONGTEXT,
  `ipAddress` VARCHAR(191),
  `status` ENUM('ACTIVE','REVOKED','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  KEY `user_sessions_userId_idx` (`userId`),
  CONSTRAINT `user_sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `tokenHash` LONGTEXT NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `usedAt` DATETIME(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `password_reset_tokens_userId_idx` (`userId`),
  CONSTRAINT `password_reset_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- EMPRESA E CONFIGURACOES
-- ============================================================================

CREATE TABLE `companies` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `displayName` VARCHAR(191),
  `cnpjCpf` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(191),
  `whatsapp` VARCHAR(191),
  `email` VARCHAR(191),
  `address` LONGTEXT,
  `businessHours` JSON,
  `status` ENUM('ACTIVE','SUSPENDED','CANCELLED') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cnpj_cpf` (`cnpjCpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `company_settings` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL UNIQUE,
  `businessName` VARCHAR(191) NOT NULL,
  `legalName` VARCHAR(191),
  `cnpjCpf` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191),
  `whatsapp` VARCHAR(191),
  `email` VARCHAR(191),
  `address` LONGTEXT,
  `city` VARCHAR(191),
  `state` VARCHAR(191),
  `postalCode` VARCHAR(191),
  `businessHours` JSON,
  `noteHeader` LONGTEXT,
  `noteFooter` LONGTEXT,
  `receiptFooter` LONGTEXT,
  `timezone` VARCHAR(191) NOT NULL DEFAULT 'America/Sao_Paulo',
  `language` VARCHAR(191) NOT NULL DEFAULT 'pt-BR',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_settings_companyId_key` (`companyId`),
  CONSTRAINT `company_settings_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CLIENTES E VEICULOS
-- ============================================================================

CREATE TABLE `customers` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191),
  `phone` VARCHAR(191) NOT NULL,
  `whatsapp` VARCHAR(191),
  `cpf` VARCHAR(191),
  `address` LONGTEXT,
  `city` VARCHAR(191),
  `state` VARCHAR(191),
  `notes` LONGTEXT,
  `status` ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `customers_companyId_idx` (`companyId`),
  UNIQUE KEY `unique_company_phone` (`companyId`, `phone`),
  CONSTRAINT `customers_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `vehicle_categories` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` LONGTEXT,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `vehicle_categories_companyId_idx` (`companyId`),
  UNIQUE KEY `unique_company_category` (`companyId`, `name`),
  CONSTRAINT `vehicle_categories_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `vehicles` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `customerId` VARCHAR(191) NOT NULL,
  `plate` VARCHAR(191) NOT NULL UNIQUE,
  `make` VARCHAR(191) NOT NULL,
  `model` VARCHAR(191) NOT NULL,
  `color` VARCHAR(191),
  `year` INT,
  `categoryId` VARCHAR(191) NOT NULL,
  `notes` LONGTEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicles_companyId_idx` (`companyId`),
  KEY `vehicles_customerId_idx` (`customerId`),
  UNIQUE KEY `unique_company_plate` (`companyId`, `plate`),
  CONSTRAINT `vehicles_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `vehicles_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `vehicles_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `vehicle_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SERVICOS E PRECOS
-- ============================================================================

CREATE TABLE `services` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` LONGTEXT,
  `durationMinutes` INT NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `services_companyId_idx` (`companyId`),
  UNIQUE KEY `unique_company_service` (`companyId`, `name`),
  CONSTRAINT `services_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `service_prices` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `serviceId` VARCHAR(191) NOT NULL,
  `vehicleCategoryId` VARCHAR(191) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `effectiveFrom` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `effectiveUntil` DATETIME(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `service_prices_companyId_idx` (`companyId`),
  UNIQUE KEY `unique_company_service_category` (`companyId`, `serviceId`, `vehicleCategoryId`),
  CONSTRAINT `service_prices_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `service_prices_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `service_prices_vehicleCategoryId_fkey` FOREIGN KEY (`vehicleCategoryId`) REFERENCES `vehicle_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- FUNCIONARIOS
-- ============================================================================

CREATE TABLE `employees` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `cpf` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191),
  `email` VARCHAR(191),
  `role` ENUM('OWNER','MANAGER','ATTENDANT','WASHER','FINANCE','OTHER') NOT NULL,
  `commissionPercentage` DECIMAL(5,2),
  `salary` DECIMAL(10,2),
  `status` ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `userId` VARCHAR(191),
  `hiredAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employees_companyId_idx` (`companyId`),
  UNIQUE KEY `unique_company_cpf` (`companyId`, `cpf`),
  CONSTRAINT `employees_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- AGENDAMENTOS E ORDENS
-- ============================================================================

CREATE TABLE `appointments` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `customerId` VARCHAR(191) NOT NULL,
  `vehicleId` VARCHAR(191) NOT NULL,
  `serviceId` VARCHAR(191) NOT NULL,
  `scheduledAt` DATETIME(3) NOT NULL,
  `status` ENUM('SCHEDULED','CONFIRMED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  `notes` LONGTEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `appointments_companyId_idx` (`companyId`),
  KEY `appointments_customerId_idx` (`customerId`),
  CONSTRAINT `appointments_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `service_orders` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `appointmentId` VARCHAR(191),
  `customerId` VARCHAR(191) NOT NULL,
  `vehicleId` VARCHAR(191) NOT NULL,
  `orderNumber` INT NOT NULL,
  `status` ENUM('DRAFT','WAITING','IN_PREPARATION','IN_SERVICE','QUALITY_CHECK','READY','DELIVERED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
  `totalPrice` DECIMAL(10,2),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `service_orders_companyId_idx` (`companyId`),
  KEY `service_orders_customerId_idx` (`customerId`),
  UNIQUE KEY `unique_company_order_number` (`companyId`, `orderNumber`),
  CONSTRAINT `service_orders_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `service_orders_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `appointments` (`id`),
  CONSTRAINT `service_orders_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `service_orders_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `service_order_items` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `serviceId` VARCHAR(191) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `service_order_items_orderId_idx` (`orderId`),
  CONSTRAINT `service_order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `service_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `service_order_items_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PAGAMENTOS E DESPESAS
-- ============================================================================

CREATE TABLE `payments` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `method` ENUM('CASH','DEBIT','CREDIT','PIX','BANK_TRANSFER','OTHER') NOT NULL,
  `status` ENUM('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `paidAt` DATETIME(3),
  `notes` LONGTEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_companyId_idx` (`companyId`),
  KEY `payments_orderId_idx` (`orderId`),
  CONSTRAINT `payments_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `service_orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `expenses` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `category` VARCHAR(191),
  `date` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `expenses_companyId_idx` (`companyId`),
  CONSTRAINT `expenses_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ESTOQUE
-- ============================================================================

CREATE TABLE `products` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` LONGTEXT,
  `quantity` INT NOT NULL DEFAULT 0,
  `costPrice` DECIMAL(10,2),
  `sellPrice` DECIMAL(10,2),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_companyId_idx` (`companyId`),
  CONSTRAINT `products_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `stock_movements` (
  `id` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `type` ENUM('ENTRADA','SAIDA','AJUSTE') NOT NULL,
  `quantity` INT NOT NULL,
  `notes` LONGTEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `stock_movements_productId_idx` (`productId`),
  CONSTRAINT `stock_movements_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- AUDITORIA
-- ============================================================================

CREATE TABLE `audit_logs` (
  `id` VARCHAR(191) NOT NULL,
  `companyId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `action` VARCHAR(191) NOT NULL,
  `entityType` VARCHAR(191) NOT NULL,
  `entityId` VARCHAR(191) NOT NULL,
  `changes` JSON,
  `ipAddress` VARCHAR(191),
  `userAgent` LONGTEXT,
  `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` ENUM('SUCCESS','FAILURE') NOT NULL DEFAULT 'SUCCESS',
  `errorMessage` LONGTEXT,
  PRIMARY KEY (`id`),
  KEY `audit_logs_companyId_idx` (`companyId`),
  KEY `audit_logs_userId_idx` (`userId`),
  KEY `audit_logs_entityId_idx` (`entityId`),
  KEY `audit_logs_timestamp_idx` (`timestamp`),
  CONSTRAINT `audit_logs_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================

-- Pronto para uso!
-- Próximo passo: Conectar API via DATABASE_URL
