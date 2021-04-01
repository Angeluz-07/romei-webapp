from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from daily_register_api.models import PaymentRegister, Store
from management.views import date_from_str
# Create your views here.

def build_stats_payments_in_range(queryset):
    import pandas as pd
    stores_with_stats = Store.objects.all()

    df = pd.DataFrame(queryset.values(), columns=['register_date','store_id','id','value'])
    sum_of_payments_by_store = df.groupby(['store_id']) \
    .agg({'value': 'sum'}) \
    .to_dict()

    def set_sum(obj):
        setattr(obj,'sum',sum_of_payments_by_store['value'][obj.id])
        return obj

    stores_with_stats = [ set_sum(obj) for obj in stores_with_stats ]

    avg_of_payments_by_date = df.groupby(['register_date', 'store_id']) \
    .agg({'value': 'sum'}).reset_index() \
    .groupby('store_id').agg({'value':'mean'}) \
    .to_dict()

    def set_avg(obj):
        setattr(obj,'avg',avg_of_payments_by_date['value'][obj.id])
        return obj

    stores_with_stats = [ set_avg(obj) for obj in stores_with_stats ]
    return stores_with_stats

def build_df_payments_in_range(queryset):
    import pandas as pd
    df = pd.DataFrame(queryset.values(), columns=['register_date','store_id','id','value'])
    df = df.groupby(['register_date', 'store_id']).agg({'value': 'sum'}).reset_index()
    df = df.pivot(index='register_date', columns='store_id', values='value').reset_index()
    df = df.rename_axis("Stores", axis = 1)
    column_names = { s.id : s.__str__() for s in Store.objects.all() }
    df = df.rename(columns=column_names)
    df = df.rename(columns={'register_date':'date'}, index={'store_id':''})
    return df

def build_plot_payments_in_range(df, date_range):
    start_date, end_date = date_range
    y_data = [df[column] for column in df.columns.tolist()]
    import plotly.express as px
    fig = px.line(
        df,
        x="date",
        y=df.columns,
        hover_data={"date": "|%B %d, %Y"},
        title='$ x por dia',
        range_x=[start_date,end_date],
    )
    fig.update_xaxes( tickformat="%A\n%b\n%d")

    from plotly.offline import plot
    plot_div = plot(fig, output_type='div', include_plotlyjs=False)
    return plot_div

@login_required(login_url='login')
def payments_in_range(request):
    context = {}
    queryset = []
    total = 0
    if request.method == 'POST':
        _start_date = request.POST.get('start_date')
        _end_date = request.POST.get('end_date')
        context['start_date'] = _start_date
        context['end_date'] = _end_date
        if _start_date and _end_date:
            start_date, end_date = date_from_str(_start_date), date_from_str(_end_date)
            queryset = PaymentRegister \
            .objects \
            .filter(
                register_date__range=(start_date,end_date)
            )
            stats = build_stats_payments_in_range(queryset)
            context['stats'] = stats
            df = build_df_payments_in_range(queryset)
            plot_div = build_plot_payments_in_range(df,(start_date,end_date))
            context['plot_div'] = plot_div
        
    context['payment_query_data'] = queryset
    context['total'] = total
    return render(request, 'report/payments_in_range.html', context)
