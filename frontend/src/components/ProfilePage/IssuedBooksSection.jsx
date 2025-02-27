import React, { useState, useEffect } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { getIssuedBooks, markBookReturned } from '../../api/axios'
import { ImCheckmark } from 'react-icons/im'

export default function IssuedBooksSection(props) {

    let [refresh, setRefresh] = useState(false)

    let [bookIdInput, setBookIdInput] = useState('')

    const [issuedBooksList, setIssuedBooksList] = useState([])
    useEffect(() => {
        getIssuedBooks(bookIdInput).then((data) => {setIssuedBooksList(data)})
        setRefresh(false)}
        , [refresh, bookIdInput])
        

    return (
        <div className='admin-action-modal'>
            <div className='admin-action-card moderator-requests-card'>
                <div className='admin-action-card-upperbar'>
                    <div>Issued Books Details</div>
                    <div className='admin-action-card-x-button' onClick={()=>props.setShowIssuedBooks(false)}>
                        <RxCross2 />
                    </div>
                </div>

                <div className='admin-action-card-search-bar issued-books-search-bar'>
                    <div className='admin-action-card-search-bar-container issued-books-search-bookid'>
                        <span>Book Id:</span>
                        <input type="text" name="name" id="issued-books-search-bookid" onChange={()=>setBookIdInput(document.getElementById("issued-books-search-bookid").value)}/>
                    </div>
                </div>

                <div className='admin-action-card-body admin-section-table-display-section'>
                    {
                        (issuedBooksList.length) ? (
                            <table className='admin-section-table'>
                                <thead className='admin-section-table-headers-container'>
                                    <tr>
                                        <th className='admin-section-table-headers issued-books-book-id'>Book Details</th>
                                        <th className='admin-section-table-headers issued-books-borrower-details'>Borrower Details</th>
                                        <th className='admin-section-table-headers issued-books-issue-date'>Issue Date</th>
                                        <th className='admin-section-table-headers issued-books-return-date'>Return Date</th>
                                        <th className='admin-section-table-headers issued-books-return-button'></th>
                                    </tr>
                                </thead>

                                <tbody className='admin-section-table-body'>
                                    {
                                        issuedBooksList.map ((issuedBook) => (
                                            <tr className='admin-section-table-details-container'>
                                                <td className='issued-books-book-id'>
                                                    <div className='issued-books-book-details-name'>
                                                        <div>
                                                            {issuedBook.book_info.name}
                                                        </div>
                                                        <div className='issued-books-book-book-id'>
                                                            {issuedBook.book_info.book_id}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='issued-books-borrower-details'>
                                                    <div className='issued-books-borrower-details-name'>
                                                        <div>
                                                            {issuedBook.member_info.name}
                                                        </div>
                                                        <div className='issued-books-borrower-roll-number'>
                                                            {issuedBook.member_info.roll_number}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='issued-books-issue-date'>{issuedBook.issue_date}</td>
                                                <td className='issued-books-return-date'>{issuedBook.return_date}</td>
                                                <td className='issued-books-return-button'>
                                                    <button onClick={()=>{
                                                        markBookReturned(issuedBook.book_info.book_id)
                                                        setRefresh(true)
                                                        }}>
                                                            <ImCheckmark />
                                                        </button>
                                                </td> 
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        ) : <div className="no-issued-books-message">All the books are in the library :|</div>
                    }
                </div>
                <div className='admin-action-lower-border'></div>
            </div>
        </div>
    )
}
