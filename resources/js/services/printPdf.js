import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const printPdf = (data)=>{
    const tittle = data.survey_tittle
    const summary_type = data.summary_type    
    const owner_title = data.owner


    if(summary_type=='reason'){
        const questions = data.questions
        const dataAnswers = data.answers

        var reasonTableContent = []
        reasonTableContent.push([ 'No', {text:'Pertanyaan',alignment: 'center'}])

        var no = 1;
        questions.forEach(q => {
            let answers = []
            answers.push(q.question)

            dataAnswers.forEach(ans => {
                if(ans.question_id===q.id){
                    if(ans.text!==null)
                    answers.push('-'+ans.text)
                }
            })
            
            reasonTableContent.push([ no,answers ])
            no++
        });

        
        var docDefinition = {
            content: [
                    {text: 'Reason summary of : '+tittle, style: 'header'},
                    'Opinion list from all surveyor'    ,
                    '',
                    {
                        style: 'tableExample',                    
                        table:{
                            widths: ['10%','90%'],
                            headerRows: 1,
                            
                            body: reasonTableContent
                        }                        

                    }    
                ],                

            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            },
            defaultStyle: {
                // alignment: 'justify'
            }
        };
        
        pdfMake.createPdf(docDefinition).open();
    }

    else{
        
        const users = data.users       
        const survey_trxs = data.survey_trxs
        const answered_trx_user = data.answered_trx_user
        const question_count = data.question_count
        let header = []
        let flexWidth =  []
        var scoreTableContent = []
        var totalScoreTableContent = []

        if(owner_title==='All employees'){
            scoreTableContent.push([ {text:'Owner Name',alignment: 'center'}, {text:'Owner NIK',alignment: 'center'},{text:'Surveyor Name',alignment: 'center'},{text:'Surveyor NIK',alignment: 'center'},{text:'Avg Score',alignment: 'center'}] )
            flexWidth = ['31%','17%','31%','17%','8%'] 
            
            users.forEach((user)=>{
                let score = 0
                if(!_.isEmpty(user.total_score_by_one_surveyor)){
                    score = user.total_score_by_one_surveyor[0].total_score
                }  

                const scoreRound = Math.round((score/question_count)*100)/100
                scoreTableContent.push([user.employee_owner.emp_name,
                                        user.employee_owner.emp_id,
                                        user.surveyor.emp_name,
                                        user.surveyor.emp_id,
                                        {text:(scoreRound),alignment: 'right'}])
            })

            //total score table content
            totalScoreTableContent.push([{text:'Employee Name',alignment: 'center'}, {text:'Total Score',alignment: 'center'},{text:'Total Average',alignment: 'center'}])
            survey_trxs.forEach(txId=>{
                let totalScore=0
                let ownerName = ''
                let surveyorCount=0
                users.forEach(user=>{
                    
                    if(user.survey_trx_id===txId){
                        if(answered_trx_user.includes(user.id)){
                            surveyorCount++ //get number of answered user
                        }                        
                        ownerName = user.employee_owner.emp_name
                        if(!_.isEmpty(user.total_score_by_one_surveyor)){
                            totalScore += (user.total_score_by_one_surveyor[0].total_score/question_count)
                        }
                    }
                })
                if(surveyorCount===0)surveyorCount=1
                const average = (totalScore/surveyorCount)
                const averageRound = Math.round(average*100)/100
                const totalScoreRound = Math.round(totalScore*100)/100
                totalScoreTableContent.push([ownerName,{text:totalScoreRound,alignment: 'right'},{text:averageRound,alignment: 'right'}])
            })
            
        }else{
            scoreTableContent.push([ {text:'Owner Name',alignment: 'center'}, {text:'Surveyor Name',alignment: 'center'},{text:'Surveyor NIK',alignment: 'center'},{text:'Avg Score',alignment: 'center'}])
            flexWidth = ['30%','40%','20%','10%']
            
            users.forEach((user)=>{
                let score = 0
                if(!_.isEmpty(user.total_score_by_one_surveyor)){
                    score = user.total_score_by_one_surveyor[0].total_score
                }
                const scoreRound = Math.round((score/question_count)*100)/100
                scoreTableContent.push([user.unit_owner.unit_name,                                        
                                        user.surveyor.emp_name,
                                        user.surveyor.emp_id,
                                        scoreRound])
            })

            //total score table content
            totalScoreTableContent.push([{text:'Unit Name',alignment: 'center'}, {text:'Total Score',alignment: 'center'},{text:'Total Average',alignment: 'center'}])
            survey_trxs.forEach(txId=>{
                let totalScore=0
                let ownerName = ''
                let surveyorCount=0
                users.forEach(user=>{
                    if(user.survey_trx_id===txId){
                        if(answered_trx_user.includes(user.id)){
                            surveyorCount++ //get number of answered user
                        }
                        ownerName = user.unit_owner.unit_name
                        if(!_.isEmpty(user.total_score_by_one_surveyor)){
                            totalScore += (user.total_score_by_one_surveyor[0].total_score/question_count)
                        }
                    }
                })
                if(surveyorCount===0)surveyorCount=1
                const average = (totalScore/surveyorCount)
                const averageRound = Math.round(average*100)/100
                const totalScoreRound = Math.round(totalScore*100)/100
                
                totalScoreTableContent.push([ownerName,{text:totalScoreRound,alignment: 'right'},{text:averageRound,alignment: 'right'}])
            })
        }

        var docDefinition = {
            content: [
                    {text: 'Score summary of : '+tittle, style: 'header'},
                    'Score list by all surveyor',
                    '',
                    {
                        style: 'tableExample',                    
                        table:{
                            widths:flexWidth,
                            headerRows: 1,
                            
                            body: scoreTableContent
                        }                        

                    },
                    {text:'Summary of Score',pageBreak: 'before'},
                    {
                        style: 'tableExample',                    
                        table:{
                            headerRows: 1,                            
                            body: totalScoreTableContent
                        }                        

                    }    
                ],                

            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            },
            defaultStyle: {
                // alignment: 'justify'
            }
        };
        
        pdfMake.createPdf(docDefinition).open();

    }

    
}

