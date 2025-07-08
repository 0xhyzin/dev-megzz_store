import { User } from "@prisma/client";
import { prisma } from "../database/data";
import { logger } from "../../utils/logger";

class UserRepository {
    public FindUserByEmail = async (email: string) => {
        let user: User | null;
        const repoHandler: RepositoiesHandler<User> = new RepositoiesHandler();
        try {
            logger.info("try Find User By Email ", { email: email, file: "UserRepo" });

            user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })
            if (user === null) {
                throw Error("There is no user with this email");
            }
        } catch (er) {
            logger.error("There is no user with this email", { email: email, errorMassege: er });
            repoHandler.message = "Log in first";
            repoHandler.isSucceed = false;
            repoHandler.body = null;
            return repoHandler;
        }
        logger.info("User Found Succssfuly", { email: user.email, name: `${user.first_name} ${user.last_name}` });
        repoHandler.message = "welcome back";
        repoHandler.isSucceed = true;
        repoHandler.body = user;
        return repoHandler;

    }
    public AddNewUser = () => {

    }
    public GetUserRole = async (userId: string) => {
        const roles = await prisma.role.findMany({
            where: { user_id: userId },
            include: {
                roletype: {
                    select: {
                        rolename:true
                    }
                }
            }
        })
        return roles.map(role => role.roletype?.rolename)
    }
}
export const userRepository: UserRepository = new UserRepository();