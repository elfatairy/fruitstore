import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOT_ENOUGH_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { createSupplier, getAllSuppliers, getSupplier, getSupplierReceiptsHelper, importItem, importItemsHelper } from '../backend/suppliers';
import { getCostsAnalysisHelper, getProfitsAnalysisHelper, getReceiptsAnalysisHelper, getSellingAnalysisHelper } from '../backend/admin';
import { AnalysisPeriods } from '../types';

export default function AdminPage() {
    const { db } = useAuth();
    const [first, setFirst] = useState(true);
    
    const getReceiptsAnalysis = async () => {
        try {
            const dayAnalysis = await getReceiptsAnalysisHelper(db!, AnalysisPeriods.DAY);
            const weekAnalysis = await getReceiptsAnalysisHelper(db!, AnalysisPeriods.WEEK);
            const monthAnalysis = await getReceiptsAnalysisHelper(db!, AnalysisPeriods.MONTH);
            const yearAnalysis = await getReceiptsAnalysisHelper(db!, AnalysisPeriods.YEAR);
            const allAnalysis = await getReceiptsAnalysisHelper(db!, AnalysisPeriods.ALL);
            if (dayAnalysis && weekAnalysis && monthAnalysis && yearAnalysis && allAnalysis) {
                console.log("analysis");
                console.log(dayAnalysis);
                console.log(weekAnalysis);
                console.log(monthAnalysis);
                console.log(yearAnalysis);
                console.log(allAnalysis);
                // JOE: Handle the analysis
            }
        } catch (error) {
            console.log("ERROR");
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                    // JOE: add this feature
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }
    const getSellingAnalysis = async () => {
        try {
            const dayAnalysis = await getSellingAnalysisHelper(db!, AnalysisPeriods.DAY);
            const weekAnalysis = await getSellingAnalysisHelper(db!, AnalysisPeriods.WEEK);
            const monthAnalysis = await getSellingAnalysisHelper(db!, AnalysisPeriods.MONTH);
            const yearAnalysis = await getSellingAnalysisHelper(db!, AnalysisPeriods.YEAR);
            const allAnalysis = await getSellingAnalysisHelper(db!, AnalysisPeriods.ALL);
            if (dayAnalysis != null && weekAnalysis != null && monthAnalysis != null && yearAnalysis != null && allAnalysis != null) {
                console.log(dayAnalysis);
                console.log(weekAnalysis);
                console.log(monthAnalysis);
                console.log(yearAnalysis);
                console.log(allAnalysis);
                console.log("analysis");
                // JOE: Handle the analysis
            }
        } catch (error) {
            console.log("ERROR");
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                    // JOE: add this feature
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }
    const getCostsAnalysis = async () => {
        try {
            const dayAnalysis = await getCostsAnalysisHelper(db!, AnalysisPeriods.DAY);
            const weekAnalysis = await getCostsAnalysisHelper(db!, AnalysisPeriods.WEEK);
            const monthAnalysis = await getCostsAnalysisHelper(db!, AnalysisPeriods.MONTH);
            const yearAnalysis = await getCostsAnalysisHelper(db!, AnalysisPeriods.YEAR);
            const allAnalysis = await getCostsAnalysisHelper(db!, AnalysisPeriods.ALL);
            if (dayAnalysis != null && weekAnalysis != null && monthAnalysis != null && yearAnalysis != null && allAnalysis != null) {
                console.log(dayAnalysis);
                console.log(weekAnalysis);
                console.log(monthAnalysis);
                console.log(yearAnalysis);
                console.log(allAnalysis);
                console.log("analysis");
                // JOE: Handle the analysis
            }
        } catch (error) {
            console.log("ERROR");
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                    // JOE: add this feature
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }
    const getProfitsAnalysis = async () => {
        try {
            const dayAnalysis = await getProfitsAnalysisHelper(db!, AnalysisPeriods.DAY);
            const weekAnalysis = await getProfitsAnalysisHelper(db!, AnalysisPeriods.WEEK);
            const monthAnalysis = await getProfitsAnalysisHelper(db!, AnalysisPeriods.MONTH);
            const yearAnalysis = await getProfitsAnalysisHelper(db!, AnalysisPeriods.YEAR);
            const allAnalysis = await getProfitsAnalysisHelper(db!, AnalysisPeriods.ALL);
            if (dayAnalysis != null && weekAnalysis != null && monthAnalysis != null && yearAnalysis != null && allAnalysis != null) {
                console.log(dayAnalysis);
                console.log(weekAnalysis);
                console.log(monthAnalysis);
                console.log(yearAnalysis);
                console.log(allAnalysis);
                console.log("analysis");
                // JOE: Handle the analysis
            }
        } catch (error) {
            console.log("ERROR");
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                    // JOE: add this feature
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    useEffect(() => {
        if(first) {
            setFirst(false);
            // getReceiptsAnalysis();
            // getCostsAnalysis();
            getProfitsAnalysis();
        }
    }, []);

    return (
        <div>AdminPage</div>
    )
}
