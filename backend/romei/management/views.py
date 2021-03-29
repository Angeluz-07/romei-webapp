from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from daily_register_api.models import PaymentRegister
# Create your views here.


def date_from_str(date:str, date_format:str="%Y-%m-%d"):
    from datetime import datetime
    return datetime.strptime(date, date_format)


@login_required(login_url='login')
def payment_query(request):
    context = {}
    queryset = []
    total = 0
    if request.method == 'POST':
        _start_date = request.POST.get('start_date')
        _end_date = request.POST.get('end_date')
        _search_text = request.POST.get('search_text')
        context['start_date'] = _start_date
        context['end_date'] = _end_date
        context['search_text'] = _search_text
        if _start_date and _end_date and _search_text:
            search_text = ' ' if _search_text.isspace() else _search_text
            start_date, end_date = date_from_str(_start_date), date_from_str(_end_date)
            queryset = PaymentRegister \
            .objects \
            .filter(
                description__icontains=search_text,
                register_date__range=(start_date,end_date),
            )
        
    context['payment_query_data'] = queryset
    context['total'] = total
    return render(request, 'management/payment_query.html', context)
