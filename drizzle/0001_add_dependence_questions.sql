ALTER TABLE `survey_responses` ADD COLUMN `quit_failed` text NOT NULL DEFAULT 'Não respondido';
ALTER TABLE `survey_responses` ADD COLUMN `knows_addiction` text NOT NULL DEFAULT 'Não respondido';
ALTER TABLE `survey_responses` ADD COLUMN `secondhand_harm` text NOT NULL DEFAULT 'Não respondido';
