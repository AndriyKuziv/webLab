import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddPlaylist(name, type){
    if (name == "" || name == null || type == null || type == ""){
        alert("Error! You have done something wrong!");
        return;
    }

    let pName = document.querySelector("#playlistName");
    let confButton = document.querySelector("#confirmButton");
    pName.setAttribute("style", "display: none");
    confButton.setAttribute("style", "display: none");

    let url = "http://localhost:5000/playlist/create";
    let h = new Headers();
    h.append('Accept', 'application/json');
    let encoded = btoa(localStorage.getItem('username') + ':' + localStorage.getItem('password'));
    let auth = 'Basic ' + encoded;
    
    h.append('Authorization', auth);

    let body = JSON.stringify({name: name, state: type});

    fetch(url, {
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': auth
        },
        body: body
    })
    .then(response => window.location.reload())
    .catch(error => console.error(error));
}

function DeletePlaylist(id){
    let url = "http://localhost:5000/playlist/" + id;

    let encoded = btoa(localStorage.getItem('username') + ':' + localStorage.getItem('password'));
    let auth = 'Basic ' + encoded;

    fetch(url, {
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': auth
        }
    })
    .then(response => response.json())
    .then(data => window.location.reload())
    .catch(error => console.error(error))
}


export function UserPrivatePlaylists(){
    const navigate = useNavigate();
    let [plName, setPlName] = useState("");
    let [visible, setVisibility] = useState(false);
    
    let [deleteMode, setDeleteMode] = useState(false);

    function changeVisibility(){
        if (visible) setVisibility(false);
        else setVisibility(true);
    }

    function changeMode(){
        if(deleteMode == false){
            setDeleteMode(true);
        }
        else setDeleteMode(false);
    }

    useEffect(() => {
        if (localStorage.length <= 0){
            alert("You do not have access");
            navigate("/login");
            return;
        }
    });

    let url = "http://localhost:5000/playlist/user/private";

    let h = new Headers();
    h.append('Accept', 'application/json');
    let encoded = btoa(localStorage.getItem('username') + ':' + localStorage.getItem('password'));
    
    let auth = 'Basic ' + encoded;
    
    h.append('Authorization', auth);
    
    let req = new Request(url, {
        method:'GET',
        headers:h,
        credentials:'same-origin'
    });

    let [pls, setPls] = useState(null);

    useEffect(() => {
        if (localStorage.length > 0){
            fetch(req)
            .then(response => response.json())
            .then(data => setPls(data))
        }
    }, []);

    return (
        <div className="playlists">
            <div className="label" id="title"><h1>{!deleteMode ? "Your private playlists" : "Choose a playlist to delete"}</h1></div>
            <input type="button" value="Add playlist" id="add-button" data-testid="add-button" onClick={changeVisibility} 
                style={{display:"inline-block"}}></input>
            <input type="text" id="playlistName" name="playlistName" placeholder="Playlist Name" value={plName} 
                onChange={e => setPlName(e.target.value)} style={!visible ? {display:"none"} : {display: "inline-block"}}></input>
            <input type="button" id="confirmButton" data-testid="confirmButton" value="Confirm" onClick={e => AddPlaylist(plName, "Private")} 
                style={!visible ? {display:"none"} : {display: "inline-block"}}></input>
            <input type="button" value={!deleteMode ? "Delete playlist" : "Cancel"} id="delete-button" data-testid="delete-button" 
                onClick={changeMode} style={{display:"inline-block", backgroundColor: "rgb(122, 20, 20)"}}></input>
            <div className="container">
                {pls && pls.map((pl) => {
                    if (!deleteMode){
                        return <>
                        <Link to={`/playlist/${pl.id}`}> 
                        <div className="playlist-button" key={pl.id} data-testid={pl.id}>
                            <h2 className="playlist-name">{pl.name.length < 14 ? pl.name : pl.name.slice(0, 13) + "..."}</h2>
                            <h4 className="playlist-creator">Creator: {pl.user_name}</h4>
                        </div>
                        </Link>
                        </>
                    }
                    else{
                        return <>
                        <div className="playlist-button-to-delete" key={pl.id} data-testid={pl.id} onClick={e => DeletePlaylist(pl.id)}>
                            <h2 className="playlist-name">{pl.name.length < 14 ? pl.name : pl.name.slice(0, 13) + "..."}</h2>
                            <h4 className="playlist-creator">Creator: {pl.user_name}</h4>
                        </div>
                        </>
                    }
                }
                )}
            </div>
        </div>
    );
}

export function UserPublicPlaylists(){
    const navigate = useNavigate();
    let [plName, setPlName] = useState("");
    let [deleteMode, setDeleteMode] = useState(false);
    let [visible, setVisibility] = useState(false);

    function changeVisibility(){
        if (visible) setVisibility(false);
        else setVisibility(true);
    }

    function changeMode(){
        if(deleteMode == false)setDeleteMode(true);
        else setDeleteMode(false);
    }

    useEffect(() => {
        if (localStorage.length <= 0){
            alert("You do not have access");
            navigate("/login");
            return;   
        }
    });

    let url = "http://localhost:5000/playlist/user/public";

    let h = new Headers();
    h.append('Accept', 'application/json');
    let encoded = btoa(localStorage.getItem('username') + ':' + localStorage.getItem('password'));

    
    let auth = 'Basic ' + encoded;
    
    h.append('Authorization', auth);
    
    let req = new Request(url, {
        method:'GET',
        headers:h,
        credentials:'same-origin'
    });

    let [pls, setPls] = useState(null);

    useEffect(() => {
        if (localStorage.length > 0){
            fetch(req)
            .then(response => response.json())
            .then(data => setPls(data))
        }
    }, []);

    return (
        <div className="playlists">
            <div className="label" id="title"><h1>{!deleteMode ? "Your public playlists" : "Choose a playlist to delete"}</h1></div>
            <input type="button" value="Add playlist" id="add-button" onClick={changeVisibility} style={{display:"inline-block"}}></input>
            <input type="text" id="playlistName" name="playlistName" placeholder="Playlist Name" value={plName} 
                onChange={e => setPlName(e.target.value)} style={!visible ? {display:"none"} : {display: "inline-block"}}></input>
            <input type="button" id="confirmButton" value="Confirm" onClick={e => AddPlaylist(plName, "Private")} 
                style={!visible ? {display:"none"} : {display: "inline-block"}}></input>
            <input type="button" value={!deleteMode ? "Delete playlist" : "Cancel"} id="delete-button" onClick={changeMode} 
                style={{display:"inline-block", backgroundColor: "rgb(122, 20, 20)"}}></input>
            <div className="container">
                {pls && pls.map((pl) => {
                    if (!deleteMode){
                        return <>
                        <Link to={`/playlist/${pl.id}`}> 
                        <div className="playlist-button" key={pl.id} data-testid={pl.id}>
                            <h2 className="playlist-name">{pl.name.length < 14 ? pl.name : pl.name.slice(0, 13) + "..."}</h2>
                            <h4 className="playlist-creator">Creator: {pl.user_name}</h4>
                        </div>
                        </Link>
                        </>
                    }
                    else{
                        return <>
                        <div className="playlist-button-to-delete" key={pl.id} data-testid={pl.id} onClick={e => DeletePlaylist(pl.id)}>
                            <h2 className="playlist-name">{pl.name.length < 14 ? pl.name : pl.name.slice(0, 13) + "..."}</h2>
                            <h4 className="playlist-creator">Creator: {pl.user_name}</h4>
                        </div>
                        </>
                    }
                }
                )}
            </div>
        </div>
    );
}