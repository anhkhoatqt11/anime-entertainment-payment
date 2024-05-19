import { getRequest } from "@/app/lib/fetch";


export const useUser = () => {
    const fetchUsersInfoByPhoneNumber = async (phoneNumber: any) => {
        const res = await getRequest ({
            endPoint: `/api/user/search?phone=${phoneNumber}`,
        });
        return res;
    };

    return { fetchUsersInfoByPhoneNumber };
}