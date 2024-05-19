import { getRequest } from "@/app/lib/fetch";

export const useUser = () => {
    const fetchUsersInfoByPhoneNumber = async (phoneNumber: any) => {
        // Replace the first '0' with '+84'
        const formattedPhoneNumber = phoneNumber.replace(/^0/, "+84");
        
        const res = await getRequest ({
            endPoint: `/api/user/search?phone=${formattedPhoneNumber}`,
        });
        return res;
    };

    return { fetchUsersInfoByPhoneNumber };
}