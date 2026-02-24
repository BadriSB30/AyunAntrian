import type { WeeklyShiftTemplateEntity } from './weeklyShiftTemplates.entity';
import type { Hari } from '@/types/enums';

// =========================
// BASE DTO
// =========================
export interface WeeklyShiftTemplateBaseDTO {
	hari: Hari;
	counter_id: number;
	admin_id: number;
	shift_id: number;
}

// =========================
// CREATE
// =========================
export type CreateWeeklyShiftTemplateDTO = WeeklyShiftTemplateBaseDTO;

// =========================
// UPDATE
// =========================
export type UpdateWeeklyShiftTemplateDTO = WeeklyShiftTemplateBaseDTO;

// =========================
// RESPONSE
// =========================
export type WeeklyShiftTemplateResponse = WeeklyShiftTemplateEntity;

// =========================
// LIST RESPONSE
// =========================
export type WeeklyShiftTemplateListResponse = WeeklyShiftTemplateResponse[];
