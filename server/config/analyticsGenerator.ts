import { Model, type Document } from "mongoose";

interface MonthData {
    month: string;
    count: number
}

export async function generateLast12MonthsData<T extends Document>(
    model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
    const last12Months: MonthData[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
        // Start of month (e.g., Aug 1, 2026 00:00:00)
        const startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
        );

        // End of month / Start of next month (e.g., Sep 1, 2026 00:00:00)
        const endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i + 1,
            1
        );

        const monthYear = startDate.toLocaleString("default", {
            month: "short",
            year: "numeric"
        });

        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        });

        last12Months.push({ month: monthYear, count });
    }

    return { last12Months };
}