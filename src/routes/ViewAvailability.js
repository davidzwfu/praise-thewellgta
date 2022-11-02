import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { getAllByAltText } from '@testing-library/react';

const colors = {'Leaders':'yellow','Vocals':'purple','Instruments':'pink','Tech':'primary'};
const date = new Date();
date.setDate(1);
date.setHours(12);
date.setMonth(date.getMonth()+1);

class ViewAvailability extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            notSubmitted: [],
            loading: true
        }
    }

    componentDidMount() {
        let getNotSubmitted = axios.get("https://praise.thewellgta.com/react-api/get-not-submitted.php", {
            params: {
                month: date.getMonth()+1,
                year: date.getFullYear()
            }
        });
        let getAvailability = axios.get("https://praise.thewellgta.com/react-api/get-availability.php", {
            params: {
                month: date.getMonth()+1,
                year: date.getFullYear()
            }
        });
        axios.all([getNotSubmitted, getAvailability]).then(axios.spread((...res) => {
            if (res[0].error)
                console.log(res[0].data);
            else
                this.setState({notSubmitted: res[0].data})
            if (res[1].error)
                console.log(res[1].data);
            else
                this.setState({data: res[1].data})
            this.setState({loading: false})
        }))

        // axios.get("https://praise.thewellgta.com/react-api/get-availability.php", {
        //     params: {
        //         month: date.getMonth()+1,
        //         year: date.getFullYear()
        //     }
        // }).then(res => {
        //     if (res.error) {
        //         console.log(res.data);
        //     }
        //     else {
        //         this.setState({
        //             data: res.data,
        //         })
        //     }
        // });
        // axios.get("https://praise.thewellgta.com/react-api/get-not-submitted.php", {
        //     params: {
        //         month: date.getMonth()+1,
        //         year: date.getFullYear()
        //     }
        // }).then(res => {
        //     if (res.error) {
        //         console.log(res.data);
        //     }
        //     else {
        //         this.setState({
        //             notSubmitted: res.data,
        //             loading: false
        //         })
        //     }
        // });
    }

    output(array, depth) {
        let ret = [];
        let i = 0;
        for(var k in array) {
            if (depth == 0) {
                ret.push(
                    <div key={i}>
                        <p className='date__header'>{k}</p>
                        <div className='card-grid'>{this.output(array[k], depth+1)}</div>
                    </div>
                );
            }
            else if (depth == 1) {
                ret.push(
                    <div className={`card card--availability card--${colors[k]}`} key={i}>
                        <div className='card__body'>
                            <div className='card__heading'>{k}</div>
                            <div className='card__subheading'></div>
                            <div>{this.output(array[k], depth+1)}</div>
                        </div>
                    </div>
                );
            }
            else if (depth == 2) {
                ret.push (
                    <p className='date__name' key={i}>
                        <svg className='schedule__icon' viewBox='0 0 24 24' dangerouslySetInnerHTML={{__html: array[k][1]}}></svg>
                        {array[k][0]}
                    </p>
                );
            }
            i++;
        }
        return ret;
    }

    render() {
        return (
            <div className="body__container">
                <div className='card__header'>
                    <h2 className='availability-title'>
                        Availability
                        {this.state.loading && <div className="footer__loader"></div>}
                    </h2>
                    <div className='calendar-title--right' id='availability'>
                        <Link to="/" className="button button--default">Edit Availability</Link>
                    </div>
                </div>

                <CSSTransition 
                    in={!this.state.loading}
                    timeout={200}
                    classNames="display"
                    unmountOnExit
                >
                    <div>
                        <p className='date__header' style={{marginBottom:'-16px'}}></p>
                        <div className='card-grid card-grid--stretch'>
                            <div className='card card--availability card--gray'>
                                <div className='card__body'>
                                    <div className='card__heading'>Not Submitted</div>
                                    <div className='card__subheading'></div>
                                    {this.state.notSubmitted.map((el, index) => {
                                        return <p className='date__name' key={index}>{el.name}</p>
                                    })}
                                </div>
                            </div>
                        </div>
                        {this.output(this.state.data, 0)}
                    </div>
                </CSSTransition>

            </div>
        )
    }
}

export default ViewAvailability;