CREATE TABLE `survey_responses` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `course` text NOT NULL,
  `period` integer NOT NULL,
  `contact` text NOT NULL,
  `frequency` text NOT NULL,
  `first_use_age` text NOT NULL,
  `first_reason` text NOT NULL,
  `less_harmful` text NOT NULL,
  `knows_substances` text NOT NULL,
  `created_at` integer NOT NULL
);
