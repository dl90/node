CREATE TABLE `user` (
  `id`             INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `email`          VARCHAR(255) UNIQUE NOT NULL,
  `created_at`     TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at`     TIMESTAMP,
  `last_accessed`  TIMESTAMP
);

CREATE TABLE `password` (
  `id`             INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `user_id`        INT UNSIGNED UNIQUE NOT NULL,
  `hash`           CHAR(97) NOT NULL,
  `previous`       CHAR(97),
  `attempt`        TINYINT UNSIGNED DEFAULT 0,
  `created_at`     TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at`     TIMESTAMP,

  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `post` (
  `id`             INTEGER PRIMARY KEY AUTO_INCREMENT,
  `description`    VARCHAR(1000) NOT NULL,
  `created`        TIMESTAMP NOT NULL DEFAULT NOW()
);
