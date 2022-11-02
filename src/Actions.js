import React from 'react';
import Axios from 'axios';

class Actions extends React.Component {
    state = {
        schedule: []
    }

    getSchedule = () => {
        Axios.get('http://localhost/api/get-schedule.php')
        .then(({data}) => {
            if (data){
                console.log(data);
            }
            else {
                this.setState({
                    schedule: data,
                });
            }
        })
        .catch(error => {
            console.log(error);
        })
    }
}

export default Actions;