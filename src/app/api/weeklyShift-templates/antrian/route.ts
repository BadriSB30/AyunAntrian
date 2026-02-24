import { WeeklyShiftTemplateService } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.service';
import { ok } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';

// =====================================================
// GET /api/weekly-shift-template/active-today
// Public (tanpa auth)
// =====================================================
export async function GET() {
	try {
		const data = await WeeklyShiftTemplateService.findActiveToday();
		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}
