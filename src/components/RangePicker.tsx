import { addDays } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react'
import { DateRangePicker, Range, RangeKeyDict } from 'react-date-range';

function RangePicker({getFunction} : {getFunction: (startDate?: Date, endDate?: Date) => void}) {
    const [showDateRange, setShowDateRange] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const [picked, setPicked] = useState(false);
    const [selectionRange, setSelectionRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });


    const handleSelect = (ranges: RangeKeyDict) => {
        console.log(ranges);
        setSelectionRange(ranges.selection);
        setShowDateRange(false);
        if(ranges.selection.endDate && ranges.selection.startDate)
            getFunction(ranges.selection.startDate, addDays(ranges.selection.endDate, 1));
        if (!picked)
            setPicked(true);
    }

    const resetDate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setPicked(false);
        getFunction();
        setSelectionRange({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        });
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!event.target || !showDateRange) return;
            console.log("Entered");
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDateRange(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [datePickerRef]);


    return (
        <div className='choose-date-container' ref={datePickerRef}>
            <div className={`choose-date-btn ${showDateRange ? 'open' : ''}`} onClick={() => { setShowDateRange(prev => !prev) }}>
                <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M7 4V2.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M17 4V2.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M21.5 9H16.625H10.75M2 9H5.875" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {
                    picked && selectionRange.startDate && selectionRange.endDate ?
                        <>
                            {selectionRange.startDate.getFullYear()}/{selectionRange.startDate.getMonth() + 1}/{selectionRange.startDate.getDate()} - {selectionRange.endDate.getFullYear()}/{selectionRange.endDate.getMonth() + 1}/{selectionRange.endDate.getDate()}
                            <button onClick={resetDate} className='close-btn'>
                                <svg width="15px" height="15px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#333">
                                    <path d="M8.00386 9.41816C7.61333 9.02763 7.61334 8.39447 8.00386 8.00395C8.39438 7.61342 9.02755 7.61342 9.41807 8.00395L12.0057 10.5916L14.5907 8.00657C14.9813 7.61605 15.6144 7.61605 16.0049 8.00657C16.3955 8.3971 16.3955 9.03026 16.0049 9.42079L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.0039C15.6133 16.3945 14.9802 16.3945 14.5896 16.0039L12.0057 13.42L9.42097 16.0048C9.03045 16.3953 8.39728 16.3953 8.00676 16.0048C7.61624 15.6142 7.61624 14.9811 8.00676 14.5905L10.5915 12.0058L8.00386 9.41816Z" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" />
                                </svg>
                            </button>
                        </> :
                        "Custom date range"
                }
            </div>
            {showDateRange && <DateRangePicker
                weekStartsOn={6}
                className='date-range-picker'
                ranges={[selectionRange]}
                onChange={handleSelect}
            />}
        </div>
    )
}

export default RangePicker