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
    currentDate.setDate(currentDate.getDate() + 1);

    for (let i = 11; i >= 0; i--) {
        // End date
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);

        // Start date
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 28);

        // Get monthYear format
        const monthYear = endDate.toLocaleString("default", { day: "numeric", month: "short", year: "numeric" });

        // Counting documents in specific range
        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        });
        last12Months.push({ month: monthYear, count });
    };
    return { last12Months }
}