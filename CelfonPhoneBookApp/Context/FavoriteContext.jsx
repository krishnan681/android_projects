import React, {createContext, useState, useEffect, useContext} from "react";
import { AuthContext } from "../Components/AuthContext";
import { Alert } from "react-native";

const FavoriteContext = createContext();
const API_BASE = 'http://signpostphonebook.in/favorites';

export const FavoriteProvider = ({children})=>{
    const {userData} = useContext(AuthContext);
    const [favoriteGroups, setFavoriteGroup] = useState([]);

    //Fetch from Backend

    const loadFavorites = async () =>{
        // const res = await fetch(`${API_BASE}/get_favorites.php?user_id=${10046}`);
        // const data = await res.json();
        // setFavoriteGroup(data);
        try{
            const response = await fetch(
                `${API_BASE}/get_favorites.php?user_id=${userData.id}`,
            );
            if(!response.ok)
                throw new Error(`Http Error? ${response.status}`);
            const jsonResponse = await response.json();
            if(Array.isArray(jsonResponse)){
                setFavoriteGroup(jsonResponse);
            }else{
                Alert.alert("Error Unexpected Response");
            }            
        }catch(error){
            console.log("error on load favorites");
        }
    };

    const addGroup = async (groupName, userId) =>{
        const res = await fetch(`${API_BASE}/add_group.php`,{
            method: "POST",
            body: JSON.stringify({user_id: userId, name: groupName}),
        })

        const data = await res.json();
        if(data.success){
            await loadFavorites();
        }
    };

    const editGroup = async (groupId, newName) =>{
        await fetch(`${API_BASE}/edit_group.php`, {
            method: 'POST',
            body : JSON.stringify({group_id:groupId, name:newName }),
        });
        await loadFavorites();
    };

    const deleteGroup = async (groupId) =>{
        await fetch(`${API_BASE}/delete_group.php`, {
            method:"POST",
            body : JSON.stringify({group_id:groupId}),
        });
        await loadFavorites();
    };

    const addMember = async (groupId, name, mobile) => {
    await fetch(`${API_BASE}/add_member.php`, {
      method: 'POST',
      body: JSON.stringify({ group_id: groupId, name, mobile }),
    });
    await loadFavorites();
    };

    const editMember = async (memberId, name, mobile) =>{
        await fetch(`${API_BASE}/edit_member.php`,{
            method:"POST",
            body: JSON.stringify({memberId: memberId, name, mobile}),
        });
        await loadFavorites();
    };

    const deleteMember = async (memberId) =>{
        await fetch(`${API_BASE}/delete_member.php`, {
            method: "POST",
            body: JSON.stringify({member_id: memberId}),
        });
        await loadFavorites();
    };

    useEffect(()=>{
        loadFavorites();
    }, [userData.id]);

    return(
        <FavoriteContext.Provider value={{
            favoriteGroups,
            addGroup,
            editGroup,
            deleteGroup,
            addMember,
            editMember,
            deleteMember,
        }}>
            {children}
        </FavoriteContext.Provider>
    );

};

export const useFavorites = () =>useContext(FavoriteContext);
