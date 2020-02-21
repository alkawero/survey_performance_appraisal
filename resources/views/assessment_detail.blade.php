<html>

<head>
    <title>Assessment Detail</title>
    <style>
        .container {
            width: 100%;
        }

        .table_header {
            width: 100%;
            display: -webkit-box;
            flex-direction: row;
            justify-content: space-between;
            background-color: #fedb75;
			height:30px;
        }

        .cell {
            padding:5px;
        }

        .center {
            text-align: center;
        }

        .right {
            text-align: right;
        }
		.persen_5 {
            width: 5%;
        }

        .persen_10 {
            width: 10%;
        }

		.persen_15 {
            width: 15%;
        }
        .persen_20 {
            width: 20%;
        }
        .persen_30 {
            width: 30%;
        }
		.persen_40 {
            width: 40%;
        }
		.persen_50 {
            width: 50%;
        }
		.persen_60 {
            width: 60%;
        }
		.persen_70 {
            width: 70%;
        }
        .persen_80 {
            width: 80%;
        }

        .aspek_container {
            border: 1px solid #c4c4c4;
            margin-bottom: 10px;
            border-radius: 4px;
			width:100%;
        }

        .aspek {
            display: -webkit-box;
            flex-direction: row;
            color: red;
            padding: 5px;
            font-weight: bold;
            border-bottom: 1px solid #c4c4c4;
            background-color: #d2fce4;
        }

        .sub_aspek_container {
            color: black;
            padding-left: 10px;
        }

        .sub_aspek {
            display: -webkit-box;
            flex-direction: row;
            padding: 5px;
            border-left: 1px solid #c4c4c4;
            border-bottom: 1px solid #c4c4c4;
            background-color: #7fcbfb;
        }

        .unsur_container {
            display: -webkit-box;
            flex-direction: row;
            padding: 5px 5px 5px 10px;
            border-left: 1px solid #c4c4c4;
            border-bottom: 1px solid #c4c4c4;
            background-color: white;
        }





        .weight {
            width: 10%;
        }

        .grand_container{
			display: -webkit-box;
            flex-direction: row;
			background-color:#fdfbbe;
			margin-bottom:10px;
			border-radius: 4px;
			height:30px;
		}
    </style>
</head>

<body>
    <div class="container">
        <div class="title">
            <h3>Assessment Detail for {{$participant_name}} </h3>
        </div>

        <div class="table_header">
            <div class="cell center persen_50">
                Indicator
            </div>
            <div class="cell persen_5">
                Weight
            </div>
            <div class="cell persen_15">
                Leader Score {{$bobot_atasan}}%
            </div>
            <div class="cell right persen_15">
                Staff Score {{$bobot_bawahan}}%
            </div>
            <div class="cell right persen_10">
                Total Score
            </div>
        </div>

        @foreach ($aspeks as $aspek)
            <div class="aspek_container">
                <div class="aspek">
                    <div class="persen_10">{{$aspek['code']}}</div>
                    <div class="persen_80">{{$aspek['name']}}</div>
                    <div class="persen_10 center">{{$aspek['score']}}</div>
                </div>
            @foreach ($sub_aspeks as $sub_aspek)
                @if ($sub_aspek['aspek_id'] === $aspek['id'])
                    <div class="sub_aspek_container">
                        <div class="sub_aspek">
                            <div class="persen_10">{{$sub_aspek['code']}}</div>
                            <div class="persen_80">{{$sub_aspek['name']}}</div>
                            <div class="persen_10 center">{{$sub_aspek['score']}}</div>
                        </div>
                        @foreach ($unsurs as $unsur)
                            @if ($unsur['sub_aspek_id'] === $sub_aspek['id'])
                                <div class="unsur_container">
                                    <div class="persen_10">{{$unsur['code']}}</div>
                                    <div class="persen_40">{{$unsur['name']}}</div>
                                    <div class="weight">{{$unsur['bobot']}}%</div>
                                    <div class="persen_20">{{$unsur['atasan_score']}}</div>
                                    <div class="persen_20">{{$unsur['staff_score']}}</div>
                                </div>
                            @endif
                        @endforeach
                    </div>
                @endif
            @endforeach

        </div>
        @endforeach

        <div class="grand_container">
			<div class="cell persen_50">Grand Total</div>
			<div class="cell persen_40 right">{{$total_score}}</div>
        </div>

		<div class="grand_container">
			<div class="cell persen_50 ">Category</div>
			<div class="cell persen_40 right">{{$score_category}}</div>
        </div>

    </div>
</body>

</html>
