import clientApi from "@/libs/clientApi";

export const applicationService = {
  getApplicationsByTranche: async (trancheId: string) => {
    const response = await clientApi.get(`/application/tranche/${trancheId}`);
    return response.data;
  },
};
