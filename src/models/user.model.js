import { getDbData } from "../utils/firebase/firebase";

/*class User {
    email;
    password;
    profilePic;

    constructor(username, profilePic, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.profilePic = profilePic;
    }



}

export default User;*/


export const setUserData = async (user, setCurrentUser) => {
    const docUser = await getDbData("users", user.uid);
    setCurrentUser({ ...user, username: docUser?.username, sameNameCounter: docUser?.sameNameCounter, profilePic: docUser?.profilePic });
};