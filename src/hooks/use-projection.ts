import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { ProjectionResponse, projectionResponseSchema } from '@/zod/projection-schema';

/**
 * Hook to fetch end-of-month projection data
 * Returns spending projections, budget analysis, and pacing insights
 */
export const useProjection = () => {
    return useQuery({
        queryKey: ['projection'],
        queryFn: async () => {
            const { data } = await axiosClient.get<ProjectionResponse>('/analytics/forecast/end-of-month');

            // Validate response with Zod schema
            const validatedData = projectionResponseSchema.parse(data);

            return validatedData;
        },
        // Refetch every 5 minutes to keep data fresh
        refetchInterval: 5 * 60 * 1000,
        // Keep previous data while refetching
        placeholderData: (previousData) => previousData,
    });
};
