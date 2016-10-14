import React, { Component } from 'react';
import { Table, Glyphicon } from 'react-bootstrap';

export default class Gallery extends Component {
    loadMakeup(makeup, index) {
        this.props.loadMakeup(makeup, index);
    }
    render() {
        if (!this.props.makeups || !this.props.makeups.length)
            return <h3 style={{textAlign: 'center'}}>No tienes maquillajes</h3>;
        return (
            <Table hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Modelo</th>
                    <th>Productos</th>
                    <th>Fecha</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {this.props.makeups.map((makeup, index) =>
                        <tr key={index} onClick={this.loadMakeup.bind(this, makeup, index)} style={{cursor: 'pointer', backgroundColor: this.props.active === index ? '#eee' : ''}}>
                            <td>{index + 1}</td>
                            <td>{makeup.name}</td>
                            <td>{this.props.models[Number(makeup.model) - 1].name}</td>
                            <td>{makeup.used && makeup.used.length}</td>
                            <td>{makeup.createdDate}</td>
                            <td>
                                <strong style={{visibility: this.props.active === index ? 'visible' : 'hidden'}}><Glyphicon glyph="ok"/></strong>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }
}